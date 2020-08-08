const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/hook.test.js', () => {

  it('action:hook', async () => {
    const result = await app.httpRequest().post(mockUrl('test/feat/hook/echo?name=zhennann'));
    assert.equal(result.body.code, 0);
  });
});
