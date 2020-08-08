const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/settings.test.js', () => {

  it('action:settings', async () => {
    const result = await app.httpRequest().post(mockUrl('test/feat/settings'));
    assert.equal(result.body.code, 0);
  });
});
