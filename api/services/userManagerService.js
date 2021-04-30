
const register = async (server) => {


  server.route({
    method: 'POST',
    path: '/addUser',
    handler: async (request, h) => {
      const data = request.payload;

      if(!data) {
        return h.response("Missing paramters").code(404);
      }
      const { validateCreate } = server.plugins['schemaValidator'];
      const { valid, errors } = validateCreate(data);
      if (!valid) {
        return h.response(errors).code(500);
      }

      const db = request.mongo.db;
      return await db.collection('users').insertOne(data);
    },
    options: {
      description: 'Add user to the database'
    }
  });


  server.route({
    method: 'GET',
    path: '/getUser/{_id}',
    handler: async (request, h) => {
      let { params: { _id } = {} } = request;
     
      if (!_id) {
        return h.response("Missing paramters").code(404);
      }

      const db = request.mongo.db;
      const ObjectID = request.mongo.ObjectID;
      _id = new ObjectID(_id);
      const user = await db.collection('users').findOne({ _id });
      if(!user) {
        return h.response("non found user").code(404);
      }
      return user;
    },
    options: {
      description: 'find one user',
      auth: 'apiKey'
    }
  });

  server.route({
    method: 'DELETE',
    path: '/deleteUser/{_id}',
    handler: async (request, h) => {
      let { params: { _id } = {} } = request;

      if (!_id ) {
        return h.response("Missing paramters").code(404);
      }
      const db = request.mongo.db;
      const ObjectID = request.mongo.ObjectID;
      _id = new ObjectID(_id);
      return await db.collection('users').deleteOne({ _id });
    },
    options: {
      description: 'delete one user', //Add description
      auth: 'apiKey'
    }
  });


  server.route({
    method: 'PUT',
    path: '/updateUser/{_id}',
    handler: async (request, h) => {
      let { params: { _id } = {} } = request;
      const { validateUpdate } = server.plugins['schemaValidator'];
      const values = request.payload;
      if (!_id | !values) {
        return h.response("Missing paramters").code(404);
      }
      const { valid, errors } = validateUpdate(values);
      if (!valid) {
        return h.response(errors).code(500);
      }
 
      const db = request.mongo.db;
      const ObjectID = request.mongo.ObjectID;

      const query= {
        _id : new ObjectID(_id)
      }
      const update = {
         $set: values 
      }
      
      return await db
        .collection('users')
        .findOneAndUpdate(query, update);
    },
    options: {
      description: 'update one user props',
      auth: 'apiKey'
    }
  });
};

exports.plugin = {
  name: 'userManagerService',
  version: '0.0.1',
  register
};
