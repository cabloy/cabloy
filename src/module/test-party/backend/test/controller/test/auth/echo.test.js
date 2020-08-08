const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/auth/echo.test.js', () => {

  it('action:auth:echo', async () => {
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
    assert.equal(op2.id, op1.id);

    // logout
    result = await app.httpRequest().post(mockUrl('/a/base/auth/logout'));
    assert.equal(result.body.code, 0);

    // echo again
    result = await app.httpRequest().post(mockUrl('/a/base/auth/echo'));
    const op3 = result.body.data.user.op;
    assert.notEqual(op3.id, op2.id);
    assert.equal(op3.anonymous, 1);

  });

});
