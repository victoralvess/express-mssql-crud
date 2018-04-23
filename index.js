const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require('./config/knex');
const Contact = require('./models/contact');

app.get('/contacts', (req, res) => {
  Contact.query()
    .then(contacts => res.send(contacts))
    .catch(error => res.status(500).send(error));
});

/*
 * // TESTING CONNECTION
  Contact.query().then(contacts => {
    console.log(contacts);
  });
*/

app.listen(3000);
