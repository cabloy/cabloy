const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/atom/publicFlow.test.js', () => {

  it('action:publicFlow', async () => {
    const result = await app.httpRequest().post(mockUrl('test/atom/publicFlow'));
    assert.equal(result.body.code, 0);
  });

});
