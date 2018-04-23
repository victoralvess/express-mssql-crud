const { Model } = require('objection');
const Knex = require('knex');
const config = require('./connection');

const knex = Knex(config);

Model.knex(knex);
