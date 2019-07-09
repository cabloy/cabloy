const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test.test.js', () => {

  it('action:starlabel', async () => {
    const result = await app.httpRequest().get(mockUrl('test/starlabel'));
    assert(result.body.code === 0);
  });

  it('action:atom', async () => {
    const result = await app.httpRequest().get(mockUrl('test/atom'));
    assert(result.body.code === 0);
  });

  it('action:checkRightCreate', async () => {
    app.mockSession({});

    const checkRightCreates = [
      [ 'Tom', true ],
      [ 'Jimmy', true ],
      [ 'Smith', false ],
    ];
    for (const [ userName, right ] of checkRightCreates) {
      await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
        auth: userName,
        password: '123456',
      });
      const result = await app.httpRequest().post(mockUrl('test/checkRightCreate')).send({
        atomClass: { module: mockInfo().relativeName, atomClassName: 'party', atomClassIdParent: 0 },
      });
      if (right) { assert(result.body.data.id > 0); } else { assert(result.status === 403); }
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
      await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
        auth: userName,
        password: '123456',
      });
      const result = await app.httpRequest().post(mockUrl('test/checkRightRead')).send({
        key: partyKey,
      });
      if (right) { assert(result.body.data.id === partyKey.atomId); } else { assert(result.status === 403); }
    }

    // check right write
    const checkRightWrites = [
      [ 'Tom', true ],
      [ 'Tomson', false ],
    ];
    for (const [ userName, right ] of checkRightWrites) {
      await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
        auth: userName,
        password: '123456',
      });
      const result = await app.httpRequest().post(mockUrl('test/checkRightWrite')).send({
        key: partyKey,
      });
      if (right) { assert(result.body.data.id === partyKey.atomId); } else { assert(result.status === 403); }
    }

    // enable
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'Tom',
      password: '123456',
    });
    res = await app.httpRequest().post(mockUrl('/a/base/atom/enable')).send({
      key: partyKey,
    });
    assert(res.body.code === 0);

    // check right actions
    const checkRightActions = [
      [ 'Tom', false ],
      [ 'Jane', true ],
    ];
    for (const [ userName, right ] of checkRightActions) {
      await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
        auth: userName,
        password: '123456',
      });
      const result = await app.httpRequest().post(mockUrl('test/checkRightAction')).send({
        key: partyKey,
      });
      if (right) { assert(result.body.data.id === partyKey.atomId); } else { assert(result.status === 403); }
    }

    // customActionReview
    const customActionReviews = [
      [ 'Tom', false ],
      [ 'Jane', true ],
    ];
    for (const [ userName, right ] of customActionReviews) {
      await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
        auth: userName,
        password: '123456',
      });
      const result = await app.httpRequest().post(mockUrl('/a/base/atom/action')).send({
        key: partyKey,
        action: 101,
      });
      if (right) { assert(result.body.code === 0); } else { assert(result.status === 403); }
    }

    // delete
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'Tom',
      password: '123456',
    });
    res = await app.httpRequest().post(mockUrl('/a/base/atom/delete')).send({
      key: partyKey,
    });
    assert(res.body.code === 0);
  });

  it('action:checkRightFunctionUser', async () => {
    app.mockSession({});

    const checkRightFunctions = [
      [ 'Root', true ],
      [ 'Tomson', false ],
    ];
    for (const [ userName, right ] of checkRightFunctions) {
      await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
        auth: userName,
        password: '123456',
      });
      const result = await app.httpRequest().post(mockUrl('test/checkRightFunctionUser'));
      if (right) { assert(result.body.data.id > 0); } else { assert(result.status === 403); }
    }
  });

  it('action:echo', async () => {
    app.mockSession({});

    // anonymous
    let result = await app.httpRequest().get(mockUrl('test/echo/1'));
    assert(result.body.code === 0);

    // login
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'root',
      password: '123456',
    });

    // test again
    result = await app.httpRequest().get(mockUrl('test/echo/1'));
    assert(result.body.code === 0);
  });

  it('action:function', async () => {
    const result = await app.httpRequest().get(mockUrl('test/function'));
    assert(result.body.code === 0);
  });

  it('action:functionPublic', async () => {
    const result = await app.httpRequest().get(mockUrl('test/functionPublic'));
    assert(result.body.code === 0);
  });

  it('action:atomPublic', async () => {
    const result = await app.httpRequest().get(mockUrl('test/atomPublic'));
    assert(result.body.code === 0);
  });

  it('action:httpLog', async () => {
    const result = await app.httpRequest().post(mockUrl('test/httpLog?name=zhennann')).send({
      sex: 1,
    });
    assert(result.body.code === 0);
  });

  it('action:userRole', async () => {
    const result = await app.httpRequest().get(mockUrl('test/userRole'));
    assert(result.body.code === 0);
  });

});
