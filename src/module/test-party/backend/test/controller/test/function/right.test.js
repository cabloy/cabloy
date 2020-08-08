const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/function/right.test.js', () => {

  it('action:checkRightFunctionUser', async () => {
    app.mockSession({});

    const checkRightFunctions = [
      [ 'Root', true ],
      [ 'Tomson', false ],
    ];
    for (const [ userName, right ] of checkRightFunctions) {
      // login
      await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
        auth: userName,
        password: '123456',
      });
      // checkRightFunctionUser
      const result = await app.httpRequest().post(mockUrl('test/function/checkRightFunctionUser'));
      if (right) {
        assert.equal(result.body.data.id > 0, true);
      } else {
        assert.equal(result.status, 403);
      }
    }
  });
});
