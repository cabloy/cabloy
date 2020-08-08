const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/middleware.test.js', () => {

  it('action:interception', async () => {
    // success
    let result = await app.httpRequest()
      .post(mockUrl('test/feat/middleware/interception'))
      .send({
        a: '1',
        b: '2',
      });
    assert.equal(result.body.data, 3);

    // fail
    result = await app.httpRequest()
      .post(mockUrl('test/feat/middleware/interception'))
      .send();
    assert.equal(result.status, 500);
  });

  it('action:restructuring', async () => {
    // success
    const result = await app.httpRequest()
      .post(mockUrl('test/feat/middleware/restructuring'))
      .send({
        a: '1',
        b: '2',
      });
    assert.equal(result.body.data, 3);
  });

  it('action:injection', async () => {
    // success
    const result = await app.httpRequest()
      .post(mockUrl('test/feat/middleware/injection'))
      .send({
        a: '1',
        b: '2',
      });
    assert.equal(result.body.data, 3);
  });

});
