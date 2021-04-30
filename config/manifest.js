'use strict';

const schemaValidator = require('../api/services/schemaValidator');
const config = require('../config/default');
const Blipp = require('blipp');
const userManagerServic = require('../api/services/userManagerService');
const { dbOpts, hapiApikeyOps, REDIS_URL } = config;
module.exports = {
  server: {
    port: 3002,
    host: '0.0.0.0'
  },
  register: {
    plugins: [
      {
        plugin: require('hapi-api-key'),
        options: hapiApikeyOps
      },
      {
        plugin: require('hapi-mongodb'),
        options: dbOpts
       
      },
      schemaValidator,
      userManagerServic,
      Blipp
    ]
  }
};
