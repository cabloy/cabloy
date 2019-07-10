const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/atom/right.test.js', () => {

  it('action:checkRightCreate', async () => {
    app.mockSession({});

    const checkRightCreates = [
      [ 'Tom', true ],
      [ 'Jimmy', true ],
      [ 'Smith', false ],
    ];
    for (const [ userName, right ] of checkRightCreates) {
      // login
      await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
        auth: userName,
        password: '123456',
      });
      // checkRightCreate
      const result = await app.httpRequest().post(mockUrl('test/atom/checkRightCreate')).send({
        atomClass: { module: mockInfo().relativeName, atomClassName: 'party', atomClassIdParent: 0 },
      });
      if (right) {
        assert.equal(result.body.data.id > 0, true);
      } else {
        assert.equal(result.status, 403);
      }
    }
  });

  it('action:checkRight', async () => {
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
    const partyKey = res.body.data;

    // check right read
    const checkRightReads = [
      [ 'Tom', true ],
      [ 'Tomson', false ],
    ];
    for (const [ userName, right ] of checkRightReads) {
      // login
      await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
        auth: userName,
        password: '123456',
      });
      // checkRightRead
      const result = await app.httpRequest().post(mockUrl('test/atom/checkRightRead')).send({
        key: partyKey,
      });
      if (right) {
        assert.equal(result.body.data.id, partyKey.atomId);
      } else {
        assert.equal(result.status, 403);
      }
    }

    // check right write
    const checkRightWrites = [
      [ 'Tom', true ],
      [ 'Tomson', false ],
    ];
    for (const [ userName, right ] of checkRightWrites) {
      // login
      await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
        auth: userName,
        password: '123456',
      });
      // checkRightWrite
      const result = await app.httpRequest().post(mockUrl('test/atom/checkRightWrite')).send({
        key: partyKey,
      });
      if (right) {
        assert.equal(result.body.data.id, partyKey.atomId);
      } else {
        assert.equal(result.status, 403);
      }
    }

    // enable
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'Tom',
      password: '123456',
    });
    res = await app.httpRequest().post(mockUrl('/a/base/atom/enable')).send({
      key: partyKey,
    });
    assert.equal(res.body.code, 0);

    // check right actions
    const checkRightActions = [
      [ 'Tom', false ],
      [ 'Jane', true ],
    ];
    for (const [ userName, right ] of checkRightActions) {
      // login
      await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
        auth: userName,
        password: '123456',
      });
      // checkRightAction
      const result = await app.httpRequest().post(mockUrl('test/atom/checkRightAction')).send({
        key: partyKey,
      });
      if (right) {
        assert.equal(result.body.data.id, partyKey.atomId);
      } else {
        assert.equal(result.status, 403);
      }
    }

    // customActionReview
    const customActionReviews = [
      [ 'Tom', false ],
      [ 'Jane', true ],
    ];
    for (const [ userName, right ] of customActionReviews) {
      // login
      await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
        auth: userName,
        password: '123456',
      });
      // action:review
      const result = await app.httpRequest().post(mockUrl('/a/base/atom/action')).send({
        key: partyKey,
        action: 101,
      });
      if (right) {
        assert.equal(result.body.code, 0);
      } else {
        assert.equal(result.status, 403);
      }
    }

    // delete
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'Tom',
      password: '123456',
    });
    res = await app.httpRequest().post(mockUrl('/a/base/atom/delete')).send({
      key: partyKey,
    });
    assert.equal(res.body.code, 0);
  });

});
