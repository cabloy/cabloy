const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test2.test.js', () => {

  it('action:sendMail', async () => {
    const result = await app.httpRequest().get(mockUrl('test2/sendMail'));
    assert(result.body.code === 0);
  });

});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
