const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/multilevelAuthorization/user.test.js', () => {
  it('action:multilevelAuthorization:user', async () => {
    const result = await app.httpRequest().post(mockUrl('test/multilevelAuthorization/user'));
    assert.equal(result.body.code, 0);
  });
});
