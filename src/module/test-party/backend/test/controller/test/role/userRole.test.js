const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/role/userRole.test.js', () => {

  it('action:userRole', async () => {
    const result = await app.httpRequest().post(mockUrl('test/role/userRole'));
    assert.equal(result.body.code, 0);
  });

});
