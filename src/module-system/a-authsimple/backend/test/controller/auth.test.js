const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/auth.test.js', () => {

  it('action:login', async () => {
    app.mockSession({});
    // login
    const users = [
      [ 'root', true ],
      [ 'Tom', true ],
      [ 'zhennann', false ],
    ];
    for (const [ userName, success ] of users) {
      const res = await app.httpRequest().post(mockUrl(`passport/${mockInfo().relativeName}/${mockInfo().name}`)).send({
        auth: userName,
        password: '123456',
      });
      if (success) { assert(res.status === 200); } else { assert(res.status !== 200); }
    }
  });

});
