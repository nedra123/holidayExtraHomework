const fs = require('fs').promises;
const { groupBy, reduce, set } = require('lodash');
const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
var parse = require('csv-parse/lib/sync');

const averageListing = (allData) => {
  const groupedSeller = groupBy(allData, 'seller_type');
  return reduce(
    groupedSeller,
    (avg, data, type) => {
      avg.push({
        type,
        price:
          reduce(
            data,
            (accum, a) => Math.round((accum += parseInt(a.price))),
            0
          ) / data.length
      });

      return avg;
    },
    []
  );
};

const readCSVFile = async (inputFilePath) => {
  const fileContent = await fs.readFile(inputFilePath);
  const records = parse(fileContent, { columns: true });
  return records;
};

const _csvDataValidate = (payload) => {
  const schema = Joi.array().items(
    Joi.object().keys({
      make: Joi.string().min(1).required(),
      price: Joi.number().required(),
      mileage: Joi.number().min(1).required(),
      seller_type: Joi.string().min(1).required(),
      id: Joi.number().min(1).required()
    })
  );
  return schema.validate(payload);
};

const register = async (server) => {
  server.route({
    method: 'GET',
    path: '/average',
    handler: async (request, h) => {
      console.log('needra');
      const parsedJson = await readCSVFile(
        './uploads/listings.csv'
      ).catch((e) => Boom.boomify(e, { statusCode: 400 }));

      const isValid = _csvDataValidate(parsedJson);

      if (!isValid) {
        return new Boom('listings file contains bad data');
      }
      const average = averageListing(parsedJson);

      // catch((e) =>
      //   Boom.boomify(e, { statusCode: 400 })
      // );
      if (average) {
        return {
          success: true,
          average: average
        };
      } else {
        return Boom.badRequest('invalid query');
      }
    },
    options: {
      description: 'calcculate average listing by type', //Add description
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
  name: 'averageListingByType',
  version: '0.0.1',
  register
};
