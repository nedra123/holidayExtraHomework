const expect = require('chai').expect;
const { init } = require('../../app');

describe('userManagerService', () => {
  let server;
  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('should add a user with requirred schema props', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/addUser',
      payload: {
        givenName: 'nedra',
        familyName: 'ayari'
      }
    });

    expect(res.statusCode).to.equal(200);
  });

  it('should not add a user with misssing requirred schema prop familyName', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/addUser',
      payload: {
        givenName: 'nedra'
      }
    });
    const error = JSON.parse(res.payload)[0].message;
    expect(res.statusCode).to.equal(500);
    expect(error).to.eql('must NOT have fewer than 2 items');
  });

  it('should not add a user with misssing requirred schema prop givenName', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/addUser',
      payload: {
        familyName: 'nedra'
      }
    });
    const error = JSON.parse(res.payload)[0].message;
    expect(res.statusCode).to.equal(500);
    expect(error).to.eql('must NOT have fewer than 2 items');
  });
  it('should add and then get the user record with with valid authorization', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/addUser',
      payload: {
        givenName: 'nedra',
        familyName: 'ayari'
      }
    });

    expect(res.statusCode).to.equal(200);
    const userId = JSON.parse(res.payload).insertedId;
    const url = `/getUser/${userId.toString()}`;
    const res_ = await server.inject({
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'happi'
      }
    });
    expect(res_.statusCode).to.equal(200);
  });

  it('should add and then get the user record with non valid authorization', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/addUser',
      payload: {
        givenName: 'nedra',
        familyName: 'ayari'
      }
    });

    expect(res.statusCode).to.equal(200);
    const userId = JSON.parse(res.payload).insertedId;
    const url = `/getUser/${userId.toString()}`;

    const res_non_auth = await server.inject({
      method: 'get',
      url
    });
    expect(res_non_auth.statusCode).to.equal(401);
  });

  it('should update the user with valid auths', async () => {

    const findEndpoint = async (userId) => {
      const getUrl = `/getUser/${userId.toString()}`;
      return await server.inject({
        method: 'get',
        url: getUrl,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'happi'
        }
      });
    };
    const res = await server.inject({
      method: 'post',
      url: '/addUser',
      payload: {
        givenName: 'nedra',
        familyName: 'ayari'
      }
    });

    expect(res.statusCode).to.equal(200);
    const userId = JSON.parse(res.payload).insertedId;
    const url = `/updateUser/${userId.toString()}`;

    const FoundUser = await findEndpoint(userId);
    expect(JSON.parse(FoundUser.payload).givenName).to.eql("nedra");
    const res_ = await server.inject({
      method: 'put',
      url,
      payload: {
        givenName: 'nedraaa'
      },
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'happi'
      }
    });
    expect(res_.statusCode).to.equal(200);
    const FoundUser_ = await findEndpoint(userId);
    expect(JSON.parse(FoundUser_.payload).givenName).to.eql("nedraaa");
  });

  it('should not update the user with non valid auths', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/addUser',
      payload: {
        givenName: 'nedra',
        familyName: 'ayari'
      }
    });

    expect(res.statusCode).to.equal(200);
    const userId = JSON.parse(res.payload).insertedId;

    const url = `/updateUser/${userId.toString()}`;
    const res_ = await server.inject({
      method: 'put',
      url
    });
    expect(res_.statusCode).to.equal(401);
  });
  it('should not update missing values for the update', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/addUser',
      payload: {
        givenName: 'nedra',
        familyName: 'ayari'
      }
    });

    expect(res.statusCode).to.equal(200);
    const userId = JSON.parse(res.payload).insertedId;

    const url = `/updateUser/${userId.toString()}`;
    const res_ = await server.inject({
      method: 'put',
      url,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'happi'
      }
    });
    const err = res_.payload;
    expect(res_.statusCode).to.equal(404);
    expect(err).to.equal('Missing paramters');
  });

  it('should not update with non modifiable attrs (schema update)', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/addUser',
      payload: {
        givenName: 'nedra',
        familyName: 'ayari'
      }
    });

    expect(res.statusCode).to.equal(200);
    const userId = JSON.parse(res.payload).insertedId;

    const url = `/updateUser/${userId.toString()}`;
    const res_ = await server.inject({
      method: 'put',
      url,
      payload: {
        age: 'hhh'
      },
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'happi'
      }
    });
    const error = JSON.parse(res_.payload)[0].message;
    expect(res_.statusCode).to.equal(500);
    expect(error).to.eql('must NOT have additional properties');
  });

  it('should not delete the user with non valid auths', async () => {
    const res = await server.inject({
      method: 'post',
      url: '/addUser',
      payload: {
        givenName: 'nedra',
        familyName: 'ayari'
      }
    });

    expect(res.statusCode).to.equal(200);
    const userId = JSON.parse(res.payload).insertedId;

    const url = `/deleteUser/${userId.toString()}`;
    const res_ = await server.inject({
      method: 'delete',
      url
    });
    expect(res_.statusCode).to.equal(401);
  });
  it('should delete successfuly a record', async () => {
    const findEndpoint = async (userId) => {
      const getUrl = `/getUser/${userId.toString()}`;
      return await server.inject({
        method: 'get',
        url: getUrl,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'happi'
        }
      });
    };
    const res = await server.inject({
      method: 'post',
      url: '/addUser',
      payload: {
        givenName: 'nedra',
        familyName: 'ayari'
      }
    });

    expect(res.statusCode).to.equal(200);
    const userId = JSON.parse(res.payload).insertedId;

    const FoundUser = await findEndpoint(userId);
    expect(JSON.parse(FoundUser.payload)._id).to.eql(userId);

    const url = `/deleteUser/${userId.toString()}`;
    const res_ = await server.inject({
      method: 'delete',
      url,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'happi'
      }
    });

    expect(res_.statusCode).to.equal(200);
    const FoundUser_ = await findEndpoint(userId);
    expect(FoundUser_.statusCode).to.equal(404);
    expect(FoundUser_.payload).to.equal('non found user');
  });
});
