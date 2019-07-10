const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/sendMail.test.js', () => {

  it('action:sendMail', async () => {
    const result = await app.httpRequest().post(mockUrl('test/feat/sendMail'));
    assert(result.body.code === 0);
  });
});
