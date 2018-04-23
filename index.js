const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require('./config/knex');
const Contact = require('./models/contact');

/*
 * // TESTING CONNECTION
  Contact.query().then(contacts => {
    console.log(contacts);
  });
*/

app.listen(3000);
