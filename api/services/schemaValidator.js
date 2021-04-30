const Ajv = require('ajv');
const register = async (server) => {
  const validateCreate = (data) => {
    const ajv = new Ajv();
    console.log('hhh++', data);
    const schema = {
      type: 'object',
      maxProperties: 4,
      minProperties: 2,
      required: ['givenName', 'familyName'],
      properties: {
        email: { type: 'string' },
        givenName: { type: 'string' },
        familyName: { type: 'string' },
      
      },
      additionalProperties: false
    };

    const valid = ajv.validate(schema, data);
    console.log('hhh++*', valid);
    return { valid, errors: ajv.errors };
  };

  const validateUpdate = (data) => {
    const ajv = new Ajv();
    const schema = {
      type: 'object',
      maxProperties: 5,
      minProperties: 1,
      required: [],
      properties: {
        email: { type: 'string' },
        givenName: { type: 'string' },
        familyName: { type: 'string' }
      },
      additionalProperties: false
    };

    const valid = ajv.validate(schema, data);
    console.log({valid})
    return { valid, errors: ajv.errors };
  };

  server.expose('validateCreate', validateCreate);
  server.expose('validateUpdate', validateUpdate);
};

exports.plugin = {
  name: 'schemaValidator',
  version: '0.0.1',
  register
};
