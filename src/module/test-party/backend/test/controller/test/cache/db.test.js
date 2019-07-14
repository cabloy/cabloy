const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/cache/db.test.js', () => {

  it('action:cache:db', async () => {
    const result = await app.httpRequest().post(mockUrl('test/cache/db'));
    assert(result.body.code === 0);
  });

});
