const { app, mockUrl, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test.test.js', () => {

  it('actin:event test', async () => {
    app.mockSession({});
    const result = await app.httpRequest().post(mockUrl('test/test'));
    assert.equal(result.body.code, 0);
    assert.equal(result.body.data, 'returnValue');
  });

});
