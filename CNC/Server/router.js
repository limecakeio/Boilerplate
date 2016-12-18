const express = require('express');
const app     = express();
const router  = express.Router();
const cors = require('cors');
let tasks = [];
router.get('/Tasks/:id', (req, res) => {
  let rightTask;
  tasks.for(function(entry)){
    if (entry.params.id === req.params.id) rightTask = entry;
  }
  res.json(rightTask);
});
router.post('/Tasks/:id',(req,res) =>{
  //if you what you try to post is JSON
  tasks.for(function(entry)){
    if (entry.params.id === req.params.id)
    //modify that JSON object in tasks somehow accessing the parameters from the request json
    // dont know how to access values in Json Object in request body;
    else{
      res.json(message:'not ok');
    }
      }
    //if successfulL:
    res.json({message:'ok'});


  res.json({ message: 'Hooray, ' + req.params.id });
});
router.get('/Status',(req,res) => {
    res.json({ message: 'Hooray'});
});
app.use(cors());
app.use('/api', router);
app.listen(3000, () => {
    console.log('Example listening on http://localhost:3000');
});
