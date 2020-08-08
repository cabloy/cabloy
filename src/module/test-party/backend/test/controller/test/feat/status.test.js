const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/status.test.js', () => {

  it('action:status', async () => {
    const result = await app.httpRequest().post(mockUrl('test/feat/status'));
    assert.equal(result.body.code, 0);
  });
});
