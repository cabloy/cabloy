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
        atomClass: { module: mockInfo().relativeName, atomClassName: 'cook', atomClassIdParent: 0 },
      });
      if (right) { assert(result.body.data._atomClass.id > 0); } else { assert(result.status === 403); }
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
      atomClass: { module: mockInfo().relativeName, atomClassName: 'cook', atomClassIdParent: 0 },
    });
    const cookKey = res.body.data;

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
        key: cookKey,
      });
      if (right) { assert(result.body.data._atom.id === cookKey.atomId); } else { assert(result.status === 403); }
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
        key: cookKey,
      });
      if (right) { assert(result.body.data._atom.id === cookKey.atomId); } else { assert(result.status === 403); }
    }

    // enable
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'Tom',
      password: '123456',
    });
    res = await app.httpRequest().post(mockUrl('/a/base/atom/enable')).send({
      key: cookKey,
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
        key: cookKey,
      });
      if (right) { assert(result.body.data._atom.id === cookKey.atomId); } else { assert(result.status === 403); }
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
        key: cookKey,
        action: 101,
      });
      if (right) { assert(result.body.data === 'reviewed'); } else { assert(result.status === 403); }
    }

    // delete
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'Tom',
      password: '123456',
    });
    res = await app.httpRequest().post(mockUrl('/a/base/atom/delete')).send({
      key: cookKey,
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
      if (right) { assert(result.body.data._function.id > 0); } else { assert(result.status === 403); }
    }
  });

  it('actin:echo', async () => {
    app.mockSession({});
    const result = await app.httpRequest().get(mockUrl('test/echo/1'));
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

});
