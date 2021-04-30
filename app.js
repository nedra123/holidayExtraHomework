'use strict';
require('@pm2/io').init({ tracing: true });
const Glue = require('@hapi/glue');

const manifest = require('./config/manifest');

const debug = console.log; // eslint-disable-line

let testMode = false;
if (module.parent) {
  testMode = true;
}

const init = async () => {
  const server = await Glue.compose(manifest);

  server.route({
    method: 'GET',
    path: '/',
    handler: () => {
      return 'Holiday Extras';
    },
    options: {
      auth: false
    }
  });

  //////////////////////
  // START THE SERVER //
  //////////////////////

  if (testMode) {
    return server;
  } else {
    await server.start();
    debug(`Holiday Extras running at: ${server.info.uri}`); // eslint-disable-line
  }
};

process.on('unhandledRejection', (err) => {
  console.log(err); // eslint-disable-line
});

if (!testMode) {
  init();
}
module.exports = { init };
