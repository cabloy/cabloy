const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/cache/redis.test.js', () => {

  it('action:cache:redis', async () => {
    const result = await app.httpRequest().post(mockUrl('test/cache/redis'));
    assert.equal(result.body.code, 0);
  });

});
