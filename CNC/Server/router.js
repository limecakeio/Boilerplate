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
  } else{res.status(404).send('Permission denied!');}
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
} else{res.status(404).send('Permission denied!');}
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
} else{res.status(404).send('Permission denied!');}
});

/**Attempts to update a task-list element with a processed output
* as long as it hasn't been processed already
*/
router.post('/reports', (req, res) => {
if(req.get('token') === 'limecakeio' && req.body != undefined){
    let obj = req.body;
    let tasks = JSON.parse(fs.readFileSync('./tasks.json','utf-8'));
    let sync;

    //Find the responding task if it's not been processed
    let taskPosition = tasks.findIndex(findUnprocessedTaskById);
    console.log("Task Position was: ", taskPosition);
    //Write the output to the task if it hasn't been set yet
    if(taskPosition > -1) {
      //Update the task in the array
      tasks[taskPosition] = obj;
      //Write the updated task to the tasks-file
      fs.writeFile("./tasks.json", JSON.stringify(tasks), function(error) {
        if(error) {throw error;}
      });
      sync = "OK";
    } else {
      sync = "Not OK";
    };
    res.json({"message" : sync});
    /**
    * Callback function intended for array.prototype.find - like functions.
    */


    function findUnprocessedTaskById(task) {
      return task.id === obj.id && task.data.output === null;
    }
 } else{res.status(404).send('Permission denied!');}



});

module.exports = router;
