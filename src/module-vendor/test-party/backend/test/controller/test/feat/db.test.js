const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/db.test.js', () => {
  it('action:db', async () => {
    // insert
    const result = await app.httpRequest().post(mockUrl('/a/base/db/insert'), {
      tableName: 'testParty',
      data: {},
    });
    assert.equal(result.body.code, 0);
  });
});
