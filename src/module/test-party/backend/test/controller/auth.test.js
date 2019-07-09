const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/auth.test.js', () => {

  it('action:echo', async () => {
    app.mockSession({});

    // login
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'root',
      password: '123456',
    });

    // echo
    let result = await app.httpRequest().post(mockUrl('/a/base/auth/echo'));
    const op1 = result.body.data.user.op;
    assert.equal(op1.anonymous, 0);

    // echo again
    result = await app.httpRequest().post(mockUrl('/a/base/auth/echo'));
    const op2 = result.body.data.user.op;
    assert(op2.id === op1.id);

    // logout
    result = await app.httpRequest().post(mockUrl('/a/base/auth/logout'));
    assert(result.body.code === 0);

    // echo again
    result = await app.httpRequest().post(mockUrl('/a/base/auth/echo'));
    const op3 = result.body.data.user.op;
    assert.notEqual(op3.id, op2.id);
    assert.equal(op3.anonymous, 1);

  });

  it('action:login', async () => {
    app.mockSession({});
    // login
    const users = [
      [ 'root', true ],
      [ 'Tom', true ],
      [ 'zhennann', false ],
    ];
    for (const [ userName, success ] of users) {
      const res = await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
        auth: userName,
        password: '123456',
      });
      if (success) { assert(res.status === 200); } else { assert(res.status !== 200); }
    }
  });

});
