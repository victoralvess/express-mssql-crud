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
  .get((req, res, next) => {
    Contact.query()
      .where('id', req.params.id)
      .then(contact => {
        contact.length > 0
          ? res.send(contact[0])
          : res.status(404).send({error: 'Contact does not exist.'});
    })
    .catch(error => res.status(error.statusCode).send(error));
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
