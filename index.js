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

app.route('/contacts')
  .get((req, res, next) => {
    Contact.query()
      .then(contacts => res.send(contacts))
      .catch(error => res.status(500).send(error));
  })
  .patch((req, res, next) => {
    res.status(405).end();
  })
  .put((req, res, next) => {
    res.status(405).end();
  });

app.route('/contacts/:id')
  .get(async (req, res, next) => {
    try {
      const contacts = (await Contact.query().where('id', req.params.id));
      if (contacts.length > 0)
        res.send(contacts[0]);
      else
        res.status(404).send({error: 'Contact does not exist.'});
    } catch (error) {
      res.status(error.statusCode).send(error);
    }
  })
  .patch(validateBody('patch.json'), async (req, res, next) => {
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
      return res.status(200).send((await Contact.query().where('id', req.params.id))[0]);
    } catch (e) {
      return res.status(400).send(e);
    }

    res.status(500).end();
  })
  .put(async (req, res, next) => {
    const id = req.body.id;
    let update = req.body;
    delete update.id;

    try {
      const contact = await Contact.query().updateAndFetchById(id, update);
      res.status(200).send(contact);
    } catch (error) {
      res.status(400).send(error);
    }
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
