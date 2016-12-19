var fetch = require('node-fetch');


fetch('http://localhost:3000/api/Status',{methdod : 'GET'})
    .then(function(res) {
        return res.json();
    }).then((json) => {
        console.log(json);
    });
