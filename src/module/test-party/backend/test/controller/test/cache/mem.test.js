const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/cache/mem.test.js', () => {

  it('action:cache:mem', async () => {
    const result = await app.httpRequest().post(mockUrl('test/cache/mem'));
    assert.equal(result.body.code, 0);
  });

});
