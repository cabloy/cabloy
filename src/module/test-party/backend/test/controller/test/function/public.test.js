const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/function/public.test.js', () => {

  it('action:functionPublic', async () => {
    const result = await app.httpRequest().post(mockUrl('test/function/functionPublic'));
    assert.equal(result.body.code, 0);
  });
});
