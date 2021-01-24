const fs = require('fs').promises;
const { groupBy, reduce, set, flatten } = require('lodash');
var parse = require('csv-parse/lib/sync');

const percentualDestribution = (allData) => {
  const groupedSeller = groupBy(allData, 'make');
  return reduce(
    groupedSeller,
    (avg, data, make) =>
      set(
        avg,
        make,
        (data.length * 100) / flatten(Object.values(groupedSeller)).length
      ),
    {}
  );
};

const readCSVFile = async (inputFilePath) => {
  const fileContent = await fs.readFile(inputFilePath);
  const records = parse(fileContent, { columns: true });
  return records;
};

const register = async (server) => {
  server.route({
    method: 'GET',
    path: '/percentual',
    handler: async (request, h) => {
      const parsedJson = await readCSVFile('./uploads/listings.csv');
      const average = percentualDestribution(parsedJson);

      if (average) {
        return {
          success: true,
          average
        };
      } else {
        return console.log('err');
      }
    },
    options: {
      //   validate: {
      //     payload: Joi.object({
      //       emails: Joi.array().items(
      //         Joi.string()
      //           // .email()
      //           .required()
      //       )
      //     })
      //   },
      description: 'Add description', //Add description
      cors: true
      // auth: 'apiKey',
      // tags: ['api', 'sendgrid', 'email', 'validation']
    }
  });

  // percentDistribution (allData){
  //     const groupedMake = groupBy(allData, 'make')
  //     return
  // }
};

exports.plugin = {
  name: 'percentualDestribution',
  version: '0.0.1',
  register
};
