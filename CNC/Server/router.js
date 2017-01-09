const express = require('express');
const router  = express.Router();
const fs = require('fs');
let status2 = require('./status.json');
let tasks2 = require('./tasks.json');
/*let tasks = [{id :  0,type : 'hash-md5',data :{
  input:'woot',
  output: null
}}];

let status = [{id : 1,ip : "95.214.45.239",tasks : 0,workload : 0.0},
{id : 2,ip : "192.30.252.153",tasks : 0,workload : 0.0},
{id : 3,ip : "192.30.253.154",tasks : 0,workload : 0.0},
{id : 4,ip : "2a02:8071:aa2:fa00:910d:8f43:8516:a59/64",tasks : 0,workload : 0.0}
];*/
router.get('/tasks',(req,res) => {
    console.log("get tasks/");
    res.json(tasks2);
});
router.get('/status',(req,res) => {
   console.log('get status/');
   res.json(status2);
});
router.get('/tasks/:id', (req, res) => {
  console.log("get tasks/:id");
  let rightTask;
  tasks.forEach(function(entry){
    if (entry.id === req.params.id) rightTask = entry;
  });
  if  (rightTask = null) {
    response.json({message : "Not Ok"})
  } else  {res.json(rightTask)};

});
router.get('/status/:id', (req, res) => {
  console.log("get Status/:id");
  let righStatus;
  status.forEach(function(entry){
    if (entry.id === req.params.id) rightStatus = entry;
  });
  if(rightStatus = null) {
    response.json({message : "Not Ok"})
  }
  else{res.json(rightTask)};
});
// ALL POST REQUESTS
router.post('/status',(req,res) => {
  let isContained = false;
  status2.forEach(function(entry){
    //modify that JSON object in tasks somehow accessing the parameters from the request json
    if (entry.id === req.body.id) {
      isContained = true;
      entry.workload = (entry.workload + 1.0) %2;
    }
  });
      if(isContained){
        res.json({message:'ok'});
        fs.writeFile('./status.json', JSON.stringify(status2),(err) => {
          if (err) throw err;
        });
      }
    //if unsuccessfulL:
    res.json({message:'not ok'});

});
router.post('/tasks',(req,res) => {
  console.log("post /tasks ");
  let newID = 0;
  tasks2.forEach(function(entry){
    //modify that JSON object in tasks somehow accessing the parameters from the request json
    if (entry.id > newID) {
        newID = entry.id;
     }
   });
    newID++;
    tasks2.push({id : newID,type : req.body.type, data : { input : req.body.data.input}, output : null});
    fs.writeFile('./tasks.json', JSON.stringify(tasks2),(err) => {
      if (err) throw err;
    });
    res.json({message:'ok'});
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
    res.json({message:'ok'});
});
module.exports = router;
