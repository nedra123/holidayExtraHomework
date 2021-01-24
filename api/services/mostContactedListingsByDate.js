const fs = require('fs').promises;
const { groupBy, reduce, set, flatten, map, find } = require('lodash');
var parse = require('csv-parse/lib/sync');
const moment = require('moment');
const Joi = require('@hapi/joi');
const mostContactedListingsByDate = (contacts, listings) => {
  // console.log({ contacts: moment(1592498493000).utc().format()});

  const formattedDate = map(contacts, ({ contact_date, listing_id }) => {
    return {
      contact_date: moment.unix(contact_date / 1000).format('MM/DD/YYYY'),
      listing_id
    };
  });

  const groupedListingsByDate = groupBy(formattedDate, ({ contact_date }) =>
    moment(contact_date).format('YYYY/MM')
  );

  return reduce(
    groupedListingsByDate,
    (acum, contacts, date) =>
      set(
        acum,
        date,
        reduce(
          groupBy(contacts, 'listing_id'),
          (a, contacts_, listingId_) => {
            const listing = find(listings, { id: listingId_ });
            const { make, mileage, price, id } = listing;
            return a.concat({
              make,
              mileage,
              price,
              id,
              nbOfContacts: contacts_.length
            });
          },
          []
        )
      ),
    {}
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
    path: '/ListingsByDate',
    handler: async (request, h) => {
      const contacts = await readCSVFile('./uploads/contacts.csv');
      const listings = await readCSVFile('./uploads/listings.csv');

      const isValid = _csvDataValidate(contacts);
      if (!isValid) {
        return new Boom('listings file contains bad data');
      }
      
      const contactsListingsByDate = mostContactedListingsByDate(
        contacts,
        listings
      );

      if (contactsListingsByDate) {
        return {
          success: true,
          contactsListingsByDate
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
      // auth: 'apiKey'
      // tags: ['api', 'sendgrid', 'email', 'validation']
    }
  });

  // percentDistribution (allData){
  //     const groupedMake = groupBy(allData, 'make')
  //     return
  // }
};

exports.plugin = {
  name: 'mostContactedListingsByDate',
  version: '0.0.1',
  register
};
