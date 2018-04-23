const { Model } = require('objection');

class Contact extends Model {
  static get tableName() {
    return 'contacts';
  }
}

module.exports = Contact;
