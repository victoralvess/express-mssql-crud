require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const {validateBody} = require('./utils');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

require('./config/knex');
const {transaction} = require('objection');
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

app.patch('/contacts', (req, res) => {
  res.status(405).end();
});

app.patch('/contacts/:id', validateBody('patch.json'), async (req, res) => {
  try {
    await transaction(Contact.knex(), async trx => {
      for (const operation of req.body) {
        const update = {
          [operation.field]: operation.value
        };

        if (operation.op === 'update') {             
          await Contact
            .query(trx)
            .where('id', req.params.id)
            .patch(update);
        }
      }
    });
  } catch (e) {
    return res.status(400).send(e);
  }

  res.status(200).send((await Contact.query().where('id', req.params.id))[0]);
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
