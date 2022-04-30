const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('[your demo tests start from here]', () => {
  it('[demo]', async () => {
    app.mockSession({});

    // login as root
    await app
      .httpRequest()
      .post(mockUrl('/a/auth/passport/a-authsimple/authsimple'))
      .send({
        data: {
          auth: 'root',
          password: '123456',
        },
      });
  });
});
