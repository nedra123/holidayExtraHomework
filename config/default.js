const config = {
  API_KEY: 'happi',
  dbOpts: {
    url: 'mongodb://localhost:27017/HE',
    decorate: true
  },
  hapiApikeyOps: {
    schemeName: 'apiKey',
    strategy: {
      name: 'apiKey',
      mode: true, // (can be any valid strategy mode)
      apiKeys: {
        happi: {
          name: 'std key'
        }
      }
    }
  }
};

module.exports = config;
