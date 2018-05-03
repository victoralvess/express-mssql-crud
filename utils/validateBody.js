const Ajv = require('ajv');
const ajv = new Ajv();
const fs = require('fs');

module.exports = schema => {
  const validate = ajv.compile(
    JSON.parse(fs.readFileSync(__dirname + '/' + schema, 'utf-8')),
  );
  return (req, res, next) => {
    if (validate(req.body)) return next();
    return res.status(400).end();
  };
};
