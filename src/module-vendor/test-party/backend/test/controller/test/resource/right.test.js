const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/function/right.test.js', () => {
  it('action:checkRightResourceUser', async () => {
    app.mockSession({});

    const checkRightResources = [
      ['Root', true],
      ['Tomson', true],
    ];
    for (const [userName, right] of checkRightResources) {
      // login
      await app
        .httpRequest()
        .post(mockUrl('/a/auth/passport/a-authsimple/authsimple'))
        .send({
          data: {
            auth: userName,
            password: '123456',
          },
        });
      // checkRightResourceUser
      const result = await app.httpRequest().post(mockUrl('test/resource/checkRightResourceUser'));
      if (right) {
        console.log(result.body.data);
        assert.equal(result.body.data.atomId > 0, true);
      } else {
        assert.equal(result.status, 403);
      }
    }
  });
});
