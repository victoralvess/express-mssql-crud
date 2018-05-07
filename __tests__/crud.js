const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '.env.test')});
const http = require('http');
const server = require('../index.js');

let httpOptions = {
  port: process.env.PORT,
};

describe('GET Requests', () => {
  test('Get all contacts. Response code have to be 200.', done => {
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

  test('Get a non-existent contact. Response code have to be 404.', done => {
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

  test('Get a specific contact. Response code have to be 200.', done => {
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

describe('POST requests', () => {
  const options = {
    ...httpOptions,
    path: '/contacts/add',
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };

  test('Add a contact. Response code have to be 201 and "Location" header cannot be falsy.', done => {
    const req = http.request(options, res => {
      expect(res.statusCode).toBe(201);
      expect(res.headers.location).not.toBeFalsy();
      done();
    });
    req.write(
      '{ "first_name": "First Name", "last_name": "Last Name", "phone": "555-555-555" }',
    );
    req.end();
  });
});

describe('PATCH Requests', () => {
  let patchOptions;

  beforeAll(() => {
    patchOptions = {
      ...httpOptions,
      path: '/contacts/1',
      method: 'PATCH',
      headers: {
        'Content-type': 'application/json',
      },
    };
  });

  test('Update phone field of a contact. Response code have to be 200.', done => {
    const req = http.request(patchOptions, res => {
      expect(res.statusCode).toBe(200);
      done();
    });

    req.write(
      '[{ "op": "update", "field": "phone", "value": "124-585-555" },{ "op": "update", "field": "phone", "value": "668-555-899" }]',
    );
    req.end();
  });

  test('Send a invalid PATCH request body. Response code have to be 400.', done => {
    const req = http.request(patchOptions, res => {
      expect(res.statusCode).toBe(400);
      done();
    });

    req.write('{ "phone": "newPhone" }');
    req.end();
  });

  test('Try to patch all contacts. Response code have to be 405.', done => {
    http
      .request(
        {
          ...httpOptions,
          path: '/contacts',
          method: 'PATCH',
        },
        res => {
          expect(res.statusCode).toBe(405);
          done();
        },
      )
      .end();
  });
});
