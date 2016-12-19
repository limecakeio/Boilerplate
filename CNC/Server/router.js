const express = require('express');
const app     = express();
const router  = express.Router();
const cors = require('cors');
let tasks = [];
let status = [{ID : 1,IP : "95.214.45.239",Tasks : 0,Workload : 0.0},
               ID : 2,IP : "192.30.252.153",Tasks : 0,Workload : 0.0},
           	   ID : 3,IP : "192.30.253.154",Tasks : 0,Workload : 0.0},
               ID : 4,IP : "2a02:8071:aa2:fa00:910d:8f43:8516:a59/64",Tasks : 0,Workload : 0.0}];
// All GET REQUESTS
router.get('/tasks',(req,res) => {
    res.json(tasks);
}
router.get('/status',(req,res) => {
  res.json(status);
}
router.get('/Tasks/:id', (req, res) => {
  let rightTask;
  tasks.for(function(entry)){
    if (entry.id === req.params.id) rightTask = entry;
  }
  if(rightTask = null) {
    response.json({message : "Not Ok"})
  };
  else{res.json(rightTask)};

});
router.get('/Status/:id', (req, res) => {
  let righStatus;
  tasks.for(function(entry)){
    if (entry.id === req.params.id) rightStatus = entry;
  }
  if(rightStatus = null) {
    response.json({message : "Not Ok"})
  };
  else{res.json(rightTask)};
});
// ALL POST REQUESTS
router.post('/status',(req,res) => {
  //if what you try to post is JSON
  let isContained = false;
  tasks.for(function(entry)){
    //modify that JSON object in tasks somehow accessing the parameters from the request json
    if (entry.id === req.params.id) {
      isContained = true;
      entry.status = req.body.status;
    }
      }
      if(!isContained){
        res.json({message:'not ok'});
      }
    //if successfulL:
    res.json({message:'ok'});
});
}
router.post('/tasks',(req,res) => {
  //if what you try to post is JSON
  let newID = 0;
  tasks.for(function(entry)){
    //modify that JSON object in tasks somehow accessing the parameters from the request json
    if (entry.id > newID) {
        newID = entry.id;
     }
    }
    newID++;
    tasks.push({id : newID,type : req.params.type, data : { input : req.params.data.input}, output : null});
    res.json({message:'ok'});
});
}


router.post('/Tasks/:id',(req,res) => {
  //if what you try to post is JSON
  let isContained = false;
  tasks.for(function(entry)){
    //modify that JSON object in tasks somehow accessing the parameters from the request json
    // dont know how to access values in Json Object in request body;
    if (entry.id === req.params.id) {
      isContained = true;
      entry.type = req.body.type;
      entry.data.input = req.body.data.input;
    }
      }
      if(!isContained){
        res.json({message:'not ok'});
      }
    //if successfulL:
    res.json({message:'ok'});
});
app.use(cors());
app.use('/api', router);
app.listen(3000, () => {
    console.log('Example listening on http://localhost:3000');
});
