const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/stats.test.js', () => {

  it('action:stats', async () => {
    const result = await app.httpRequest().post(mockUrl('test/feat/stats'));
    assert.equal(result.body.code, 0);
  });
});
