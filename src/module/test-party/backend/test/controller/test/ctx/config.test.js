const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/ctx/config.test.js', () => {

  it('action:config', async () => {
    const result = await app.httpRequest().post(mockUrl('test/ctx/config/test'));
    assert.equal(result.body.code, 0);
  });
});
