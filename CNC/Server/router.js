const express = require('express');
const router  = express.Router();
const fs = require('fs');
let status2 = JSON.parse(fs.readFileSync('./status.json','utf-8'));
let tasks2 = JSON.parse(fs.readFileSync('./tasks.json','utf-8'));


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
  let status = require('./status.json');
   res.json(status);
});
router.get('/tasks/:id', (req, res) => {
  let correctTask;
  tasks2.forEach(function(entry){
    if (entry.id == req.params.id) {
    correctTask = entry;
  }
  });
  console.log(correctTask);
  if  (correctTask == null) {
    response.json({message : "Not Ok"})
  } else  {res.json(correctTask)};
});

router.get('/status/:id', (req, res) => {
  console.log("get Status/:id");
  let righStatus;
  status.forEach(function(entry){
    if (entry.id === req.params.id) correctStatus = entry;
  });
  if(correctStatus = null) {
    response.json({message : "Not Ok"})
  }
  else{res.json(correctTask)};
});
// ALL POST REQUESTS
router.post('/status',(req,res) => {
  let isContained = false;
  let status = require('./status.json');
  status.forEach(entry => {  //modify that JSON object in tasks somehow accessing the parameters from the request json
    if (entry.id === req.body.id) {
      isContained = true;
      entry.workload = (entry.workload + 1.0) %2;
    };
  });
      if(isContained){
        fs.writeFile('./status.json', JSON.stringify(status),(err) => {
          if (err) throw err;
        });
        res.json({message:'OK'});
      }
    res.json({message:'not ok'});
});

router.post('/tasks',(req,res) => {
  //if(req.get('token') === 'limecakeio'){
  let newID;
  console.log("post /tasks");
  if(tasks2[0] === undefined) {
    newID = 0;
  }
  else{
     newID = tasks2[tasks2.length-1].id;
     ++newID;
     console.log(newID);

// TODO for you noobs:
// google array prototype find, forEach, map, unique, filter
// TODO fat arrow functions
}

    tasks2.push({id : newID,type : req.body.type, data : { input : req.body.data.input, output : null}});
    fs.writeFile('./tasks.json', JSON.stringify(tasks2),(err) => {
      if (err) throw err;
    });
    res.json({message:'OK'});

  //} else {
    //res.json({message:'NOT OK'})}
  });
router.post('/tasks/:id',(req,res) => {
  console.log("post /tasks/id ");
  //if what you try to post is JSON
  let isContained = false;
  tasks.for(function(entry){
    //modify that JSON object in tasks somehow accessing the parameters from the request json
    // dont know how to access values in Json Object in request body;
    if (entry.id === req.body.id) {
      isContained = true;
      entry.type = req.body.type;
      entry.data.input = req.body.data.input;
    }
  });
      if(!isContained){
        res.json({message:'not ok'});
      }
    //if successfulL:
    res.json({message:'OK'});
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
  let bots = require('./bots.json');
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
  let tasks = require('./tasks.json');

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
