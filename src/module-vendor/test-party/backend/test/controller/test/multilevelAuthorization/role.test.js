const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/multilevelAuthorization/role.test.js', () => {
  it('action:multilevelAuthorization:role', async () => {
    const result = await app.httpRequest().post(mockUrl('test/multilevelAuthorization/role'));
    assert.equal(result.body.code, 0);
  });
});
