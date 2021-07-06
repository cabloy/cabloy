const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/resource/all.test.js', () => {
  it('action:all', async () => {
    const result = await app.httpRequest().post(mockUrl('test/resource/all'));
    assert.equal(result.body.code, 0);
  });
});
