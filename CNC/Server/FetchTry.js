var http = require('http');

let data  = http.get('http://localhost:3000/api/tasks/1',(res) => {
  res.setEncoding('utf-8')
  res.on('error',console.error)
  res.on('data',console.log)
});
