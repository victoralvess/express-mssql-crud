const http = require('http');
const server = require('../index.js');

describe('testing GET request at /contacts', () => {
  test('return status code have to be 200', (done) => {
    http.request({
      port: process.env.PORT,
      path: '/contacts',
    }, res => {     
      expect(res.statusCode).toBe(200);
      done();
    }).end();
  });
});
