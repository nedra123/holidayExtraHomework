const fs = require('fs');

const register = async (server) => {
  // const readCSV = (file) => {
  //   let allData = [];
  //   fs.createReadStream(file)
  //     .pipe(csv())
  //     .on('data', (row) => {
  //       try {
  //         allData.push(row);
  //       } catch (err) {
  //         //error handler
  //       }
  //     })
  //     .on('end', () => {});
  // };

  // percentDistribution (allData){
  //     const groupedMake = groupBy(allData, 'make')
  //     return
  // }

  // const uploadFile = () => {
  //   console.log('uploadFile');
  // };

  // server.expose('uploadFile', uploadFile);

  server.route({
    method: 'POST',
    path: '/uploadFile',
    handler: (request, h) => {
      const data = request.payload;
      const _keys = Object.keys(data);
      _keys.map((f) => {
        if (data[f]) {
          const name = data[f].hapi.filename;
          const path = './uploads/' + name;

          const file = fs.createWriteStream(path);
          //validate file
          // server.plugins['schemaValidator'].validate(file);

          file.on('error', (err) => console.error(err));

          data[f].pipe(file);

          data[f].on('end', (err) => {
            const ret = {
              filename: data[f].hapi.filename,
              headers: data[f].hapi.headers
            };
            return JSON.stringify(ret);
          });
        }
      });

      return {
        success: true
      };
    },
    options: {
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data'
      },
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
  // server.expose('schemaValidator', schemaValidator);
};

exports.plugin = {
  name: 'uploadFile',
  version: '0.0.1',
  register
};
