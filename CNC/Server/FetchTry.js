var http = require('http');

let data  = http.get('http://localhost:3000/api/status/3',(res) => {
  res.setEncoding('utf-8')
  res.on('error',console.error)
  res.on('data',console.log)
});
var post_options = {
      host: 'localhost',
      port: '3000',
      path: '/api/tasks/3',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'token' : 'limecakeisso'
      }
  };
  let response = {
    id: 3,
    type: 'hash-md5',
    data: {
        input: 'woot',
    }
};

  // Set up the request
  var post_req = http.request(post_options, (res) =>  {
      res.setEncoding('utf8');
      res.on('error', console.error);
      res.on('data', console.log);
  });
post_req.write(JSON.stringify(response));
post_req.end();
