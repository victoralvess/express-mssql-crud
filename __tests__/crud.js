const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '.env.test')});
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

describe('testing GET request at /contacts/{id}', () => {
  test('return 404 status code if the contact does not exist', done => {
    http
      .request(
        {
          ...httpOptions,
          path: '/contacts/0',
        },
        res => {
          expect(res.statusCode).toBe(404);
          done();
        },
      )
      .end();
  });

  test('return 200 status code if the contact exists', done => {
    http
      .request(
        {
          ...httpOptions,
          path: '/contacts/1',
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
  const options = {
    ...httpOptions,
    path: '/contacts/add',
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };

  test('returned status code have to be 201 when a contact is added', done => {
    const req = http.request(options, res => {
      expect(res.statusCode).toBe(201);
      done();
    });
    req.write(
      '{ "first_name": "First Name", "last_name": "Last Name", "phone": "555-555-555" }',
    );
    req.end();
  });

  test('verifies if Location header was set after a contact addition', done => {
    const req = http.request(options, res => {
      expect(res.headers.location).not.toBeFalsy();
      done();
    });
    req.write(
      '{ "first_name": "First Name", "last_name": "Last Name", "phone": "555-555-555" }',
    );
    req.end();
  });
});

describe('testing PATCH request at /contacts/{id}', () => {
  let patchOptions;

  beforeAll(() => {
    patchOptions = {
      ...httpOptions,
      path: '/contacts/1',
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
    }  
  });

  test('tests phone update of a specific contact, verifying the status code that must be 200', done => {
    const req = http.request(
      patchOptions,
      res => {
        expect(res.statusCode).toBe(200);
        done();
      },
    );

    req.write('[{ "op": "update", "field": "phone", "value": "124-585-555" },{ "op": "update", "field": "phone", "value": "668-555-899" }]');
    req.end();
  });

  test('tests invalid PATCH body syntax, must return 400', done => {
    const req = http.request(
      patchOptions,
      res => {
        expect(res.statusCode).toBe(400);
        done();
      }
    );

    req.write('{ "phone": "newPhone" }');
    req.end();
  });
});
