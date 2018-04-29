const { Model } = require('objection');

class Contact extends Model {
  static get tableName() {
    return 'contacts';
  }

  get fullName() {
    return `${this.first_name} ${this.last_name}`;
  }
}

module.exports = Contact;
