const express = require('express');
const router  = express.Router();
const fs = require('fs');

/*function sortTasks(array) {
  array.sort((a, b) => {
    return b.id - a.id;
  });
}*/

router.get('/tasks',(req,res) => {
    let tasks = JSON.parse(fs.readFileSync('./tasks.json','utf-8'));
    res.json(tasks);
});
router.get('/status',(req,res) => {
  let status = JSON.parse(fs.readFileSync('./status.json','utf-8'));
  res.json(status);
});
router.get('/tasks/:id', (req, res) => {
  let tasks = JSON.parse(fs.readFileSync('./tasks.json','utf-8'));
  // Tasks[task.length-1] has the biggest id since the array is always sorted so any id smaller than the array's length but bigger than 0 is contained
  if(req.params.id <= tasks[tasks.length-1].id && req.params.id > 0) {
    res.json(tasks[req.params.id-1]);
  }
  else { res.json({message: 'Not ok'}); }
});

router.get('/status/:id', (req, res) => {
  let status = JSON.parse(fs.readFileSync('./status.json','utf-8'));
  if(req.params.id <= status[status.length-1].id && req.params.id > 0) {
    res.json(status[req.params.id-1]);
  }
  else { res.json({message: 'Not ok'}); }
});
// ALL POST REQUESTS
router.post('/status',(req,res) => {
  if(req.get('token')  === 'limecakeio' && req.body.id != undefined){
    let status = JSON.parse(fs.readFileSync('./status.json','utf-8'));
    if(req.body.id <= status[status.length-1].id && req.body.id > 0) {
      correctEntry = status[req.body.id-1];
      correctEntry.workload = (correctEntry.workload + 1.0) %2;
      fs.writeFile('./status.json', JSON.stringify(status),(err) => {
        if (err) throw err;
      });
      res.json({message:'OK'});
    } else{res.json({message: 'Not Ok'})}
  } else{res.json({message:'not ok'});}
});

router.post('/tasks',(req,res) => {
  if(req.get('token') === 'limecakeio' && req.body != undefined){
    let tasks = JSON.parse(fs.readFileSync('./tasks.json','utf-8'));
    let newID = 1;
    if(tasks[0] != undefined) {
       newID = tasks[tasks.length-1].id;
       ++newID;
  }
    tasks.push({id : newID,type : req.body.type, data : { input : req.body.data.input, output : null}});
    fs.writeFile('./tasks.json', JSON.stringify(tasks),(err) => {
      if (err) throw err;
      });
    res.json({message:'OK'});
} else {res.json({message:'NOT OK'})}
  });

router.post('/tasks/:id',(req,res) => {
  if(req.get('token') === 'limecakeio' && req.body != undefined){
    let tasks = JSON.parse(fs.readFileSync('./tasks.json','utf-8'));
    // changes input and type of right entry
    if(req.params.id <= tasks[tasks.length-1].id && req.params.id > 0) {
      entry = tasks[req.params.id-1];
      entry.type = req.body.type;
      entry.data.input = req.body.data.input;
      fs.writeFile('./tasks.json', JSON.stringify(tasks),(err) => {
        if (err) throw err;
        });
        res.json({message: 'Ok'});
      } else { res.json({message: 'Not ok'}); }
} else { res.json({message: 'Not ok'}); }
});

/**
Reports implementation
*/
const crypto = require('crypto');

/**Report GET-Request serves the current BOT-Report*/
router.get('/reports', (req, res) => {
  console.log("GET for Reports called.");
  fs.readFile('./bots.json','utf-8',(err,data) => {
   if (err) throw err;
   data = JSON.parse(data);
   res.send(data);
 });
});

/**Report POST-Request processes the current object and removes it from the task list*/
router.post('/reports', (req, res) => {
  let obj = req.body;
  let bots = JSON.parse(fs.readFileSync('./bots.json','utf-8'));
  let sync = "Not OK";

  //We don't want to process the same input and hash-type twice
  let findResult = bots.find(findInputAndType);

  if(typeof findResult === "undefined") {//Calculate and set the hash for the given object
    let hashType = obj.type.split("-");
    //No support for "crack-"
    if(hashType[0] === "hash") {
      let hashSum = crypto.createHash(hashType[1]);
      hashSum.update(obj.data.input);
      obj.data.output = hashSum.digest('hex');
      sync = "Ok"
    }
  } else {
    obj.data.output = findResult.data.output;
  };

  //Add the sync result to the object
  obj.data["sync"] = sync;

  //Add the object to the bot list
  bots.push(obj);

  //Write the updated data back to the bots-file
  fs.writeFile("./bots.json", JSON.stringify(bots), function(error) {
    if(error) {throw error;}
  });

  //Remove the entry from the tasks list
  let tasks = JSON.parse(fs.readFileSync('./tasks.json','utf-8'));

  //Get the index position of the element to remove
  let processedPosition = tasks.findIndex(processedIndex);

  if(processedPosition !== -1) {
    //If located remove the element
    tasks.splice(processedPosition, 1);
    //Write the result back to the file
    fs.writeFile("./tasks.json", JSON.stringify(tasks), function(err) {
      if(err) {throw err;}
    });
  }

  //Inform the client of the result
  res.send({"message" : sync});

  /*
  Callback function for an array.find function call
  Checks whether the current list of bots has already processed
  a given input and hash-type and returns this object if it's the case.
  */
  function findInputAndType(task) {
    //Look if the results contain an object that has previously processed the same input and hash-type
    return task.data.input === obj.data.input && task.type === obj.type;
  }

  /*
  Callback function for an array.find function call
  Locates the index of the task that was just processed in order to remove it.
  */
  function processedIndex(task) {
    //Look if the results contain an object that has previously processed the same input and hash-type
    return task.data.id === obj.data.id;
  };
});

module.exports = router;
