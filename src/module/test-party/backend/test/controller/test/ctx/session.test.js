const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/ctx/session.test.js', () => {

  it('action:session', async () => {
    app.mockSession({});

    // anonymous
    let result = await app.httpRequest().post(mockUrl('test/ctx/session'));
    assert(result.body.code === 0);

    // login
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'root',
      password: '123456',
    });

    // test again
    result = await app.httpRequest().post(mockUrl('test/ctx/session'));
    assert(result.body.code === 0);
  });
});
