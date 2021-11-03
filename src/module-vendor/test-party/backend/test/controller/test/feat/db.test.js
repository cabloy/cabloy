const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/db.test.js', () => {
  it('action:db', async () => {
    let result;
    // iid
    result = await app.httpRequest().post(mockUrl('/a/base/db/iid'));
    const iid = result.body.data;
    assert(iid > 0);
    // insert
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/db/insert'))
      .send({
        tableName: 'testParty',
        data: {
          iid,
          deleted: 0,
          personCount: 8,
        },
      });
    assert.equal(result.body.code, 0);
    const partyId = result.body.data.insertId;
    // select
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/db/select'))
      .send({
        tableName: 'testParty',
        options: {
          where: {
            id: partyId,
          },
        },
      });
    assert.equal(result.body.code, 0);
    assert.equal(result.body.data[0].id, partyId);
    assert.equal(result.body.data[0].personCount, 8);
    // update
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/db/update'))
      .send({
        tableName: 'testParty',
        data: {
          id: partyId,
          personCount: 9,
        },
      });
    assert.equal(result.body.code, 0);
    assert.equal(result.body.data.affectedRows, 1);
    // get
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/db/get'))
      .send({
        tableName: 'testParty',
        where: {
          id: partyId,
        },
      });
    assert.equal(result.body.code, 0);
    assert.equal(result.body.data.id, partyId);
    assert.equal(result.body.data.personCount, 9);
    // count
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/db/count'))
      .send({
        tableName: 'testParty',
        where: {
          id: partyId,
        },
      });
    assert.equal(result.body.code, 0);
    assert.equal(result.body.data, 1);
    // delete
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/db/delete'))
      .send({
        tableName: 'testParty',
        where: {
          id: partyId,
        },
      });
    assert.equal(result.body.code, 0);
    assert.equal(result.body.data.affectedRows, 1);
    // query
    result = await app
      .httpRequest()
      .post(mockUrl('/a/base/db/query'))
      .send({
        sql: 'select * from testParty where iid=? and id=?',
        params: [iid, partyId],
      });
    assert.equal(result.body.code, 0);
    assert.equal(result.body.data.length, 0);
  });
});
