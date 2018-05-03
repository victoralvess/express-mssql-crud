require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const {validateBody} = require('./utils');
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

app.get('/contacts/:id', (req, res) => {
  Contact.query()
    .where('id', req.params.id)
    .then(contact => {
      contact.length > 0
        ? res.send(contact[0])
        : res.status(404).send({error: 'Contact does not exist.'});
    })
    .catch(error => res.status(error.statusCode).send(error));
});

app.patch('/contacts/:id', validateBody('patch.json'), (req, res) => {
  res.status(200).end();
});

app.post('/contacts/add', async (req, res) => {
  const {first_name, last_name, phone} = req.body;

  try {
    const contact = await Contact.query().insert({
      first_name,
      last_name,
      phone,
    });
    res.location(`/contacts/${contact.id}`);
    res.status(201).send(contact);
  } catch (error) {
    res.status(error.statusCode).send(error);
  }
});

app.listen(process.env.PORT);
