const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/auth/login.test.js', () => {

  it('action:auth:login', async () => {
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
      if (success) {
        assert.equal(res.status, 200, userName);
      } else {
        assert.notEqual(res.status, 200, userName);
      }
    }

  });

});
