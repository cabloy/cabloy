const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/ctx/transaction.test.js', () => {

  it('action:transaction:fail', async () => {
    app.mockSession({});

    // login
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'Tom',
      password: '123456',
    });

    // create
    let res = await app.httpRequest().post(mockUrl('/a/base/atom/create')).send({
      atomClass: { module: mockInfo().relativeName, atomClassName: 'party', atomClassIdParent: 0 },
    });
    const atomKey = res.body.data;

    // try to change info
    const itemNew = {
      atomName: 'test:transaction',
      personCount: 0,
    };
    res = await app.httpRequest().post(mockUrl('test/ctx/transaction')).send({
      key: atomKey,
      item: itemNew,
    });
    assert.equal(res.status, 500);

    // check info
    res = await app.httpRequest().post(mockUrl('/a/base/atom/read')).send({
      key: atomKey,
    });
    const item = res.body.data;
    assert.notEqual(item.atomName, itemNew.atomName);
    assert.equal(item.personCount, 0);

    // delete
    res = await app.httpRequest().post(mockUrl('/a/base/atom/delete')).send({
      key: atomKey,
    });
    assert.equal(res.body.code, 0);

  });

  it('action:transaction:success', async () => {
    app.mockSession({});

    // login
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'Tom',
      password: '123456',
    });

    // create
    let res = await app.httpRequest().post(mockUrl('/a/base/atom/create')).send({
      atomClass: { module: mockInfo().relativeName, atomClassName: 'party', atomClassIdParent: 0 },
    });
    const atomKey = res.body.data;

    // try to change info
    const itemNew = {
      atomName: 'test:transaction',
      personCount: 3,
    };
    res = await app.httpRequest().post(mockUrl('test/ctx/transaction')).send({
      key: atomKey,
      item: itemNew,
    });
    assert.equal(res.body.code, 0);

    // check info
    res = await app.httpRequest().post(mockUrl('/a/base/atom/read')).send({
      key: atomKey,
    });
    const item = res.body.data;
    assert.equal(item.atomName, itemNew.atomName);
    assert.equal(item.personCount, itemNew.personCount);

    // delete
    res = await app.httpRequest().post(mockUrl('/a/base/atom/delete')).send({
      key: atomKey,
    });
    assert.equal(res.body.code, 0);

  });

});
