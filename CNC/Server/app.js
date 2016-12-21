const express = require('express');
const app     = express();
const router = require("./router");
const cors = require('cors');
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use(cors());
app.use('/api', router);
app.listen(3000, () => {
    console.log('Example listening on http://localhost:3000');
});
