const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/function/all.test.js', () => {

  it('action:all', async () => {
    const result = await app.httpRequest().post(mockUrl('test/function/all'));
    assert.equal(result.body.code, 0);
  });
});
