const { Model } = require('objection');

class Contact extends Model {
  static get tableName() {
    return 'contacts';
  }

  get fullName() {
    return `${this.first_name} ${this.last_name}`;
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['first_name', 'last_name', 'phone'],
      properties: {
        id: { type: 'integer' },
        first_name: { type: 'string', minLength: 3, maxLength: 80 },
        last_name: { type: 'string', minLength: 2, maxLength: 80 }
      }
    };
  }
}

module.exports = Contact;
