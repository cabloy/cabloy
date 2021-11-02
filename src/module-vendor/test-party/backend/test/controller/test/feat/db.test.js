const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe.only('test/controller/test/feat/db.test.js', () => {
  it('action:db', async () => {
    let result;
    // iid
    result = await app.httpRequest().post(mockUrl('/a/base/db/iid'));
    const iid = result.body.data;
    assert(iid > 0);
    // insert
    result = await app.httpRequest().post(mockUrl('/a/base/db/insert')).send({
      tableName: 'testParty',
      data: {},
    });
    assert.equal(result.body.code, 0);
  });
});
