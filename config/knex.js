require('dotenv').config();
const { Model } = require('objection');
const Knex = require('knex');
const config = require('./connection');

const knex = Knex(config[process.env.ENV]);

Model.knex(knex);
