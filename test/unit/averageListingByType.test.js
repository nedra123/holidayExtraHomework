const chai = require('chai');
const expect = require('chai').expect;
const sinonChai = require('sinon-chai');
const { fake, createSandbox } = require('sinon');

 const createAverage = createSandbox();

const { init } = require('../../app');

describe('GET /', () => {
  let server;
  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/'
    });
    console.log('hhhkk',res.statusCode);
    expect(res.statusCode).to.equal(200);
  });
  it('responds with 200', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/average'
    });
    expect(res.statusCode).to.equal(200);
  });
  it('it should call funcction', async () => {
    const res = await server.inject({
      method: 'get',
      url: '/average'
    });
    expect(res.statusCode).to.equal(200);
    let fakeReset = fake();
    const average = server.plugins['averageListingByType'];
    createAverage.replace(
        average,
        'averageListing',
        fakeReset
      );
      expect(fakeReset).to.be.called

  });

});

