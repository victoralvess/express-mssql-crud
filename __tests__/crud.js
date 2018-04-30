const path = require('path');
console.log(
  require('dotenv').config({path: path.resolve(__dirname, '.env.test')}),
);
const http = require('http');
const server = require('../index.js');

let httpOptions = {
  port: process.env.PORT,
};

describe('testing GET request at /contacts', () => {
  test('returned status code have to be 200', done => {
    http
      .request(
        {
          ...httpOptions,
          path: '/contacts',
        },
        res => {
          expect(res.statusCode).toBe(200);
          done();
        },
      )
      .end();
  });
});

describe('testing POST request at /contacts/add', () => {
  test('returned status code have to be 201 when a contact is added', done => {
    const req = http.request(
      {
        ...httpOptions,
        path: '/contacts/add',
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
      },
      res => {
        expect(res.statusCode).toBe(201);
        done();
      },
    );
    req.write('{ "first_name": "First Name", "last_name": "Last Name", "phone": "555-555-555" }');
    req.end();
  });
});
