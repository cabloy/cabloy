const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/ctx/tail.test.js', () => {

  it('action:tail', async () => {
    const result = await app.httpRequest().post(mockUrl('test/ctx/tail'));
    assert.equal(result.body.code, 0);
  });
});
