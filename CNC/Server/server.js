const express = require('express');
const app = express();

//TEMPLATE FOR GET REQUEST
app.get('/', (request, response) => {
  response.send("YAY");
})

//SERVE 404 ON BAD request
app.use(function(request, response, next) {
  response.status(404).send("Can't bloody find it!");
})

//SERVE 500 ON SERVER ERROR
app.use(function(error, request, response, next) {
  console.error(error.stack);
  response.status(500).send("Oh the humanity! Something went wrong on our side, our bad!");
})

app.listen(3000);
