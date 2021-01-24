'use strict';

const averageListingByType = require('../api/services/averageListingByType');
const percentualDestribution = require('../api/services/percentualDestribution');
const mostContactedListingsByDate = require('../api/services/mostContactedListingsByDate');
const config = require('../config/default');
const Blipp = require('blipp');
// const case4 = require('../api/services/4');
const uploadFile = require('../api/services/uploadFile');

module.exports = {
  server: {
    port: 3002,
    host: '0.0.0.0'
  },
  register: {
    plugins: [
      {
        plugin: require('hapi-api-key'),
        options: {
          schemeName: 'apiKey',
          strategy: {
            name: 'apiKey',
            mode: true, // (can be any valid strategy mode)
            apiKeys: {
              [config.API_KEY]: {
                name: 'std key'
              }
            }
          }
        }
      },
      averageListingByType,
      percentualDestribution,
      mostContactedListingsByDate,
      // case4,
      uploadFile,
      Blipp

    ]
  }
};
