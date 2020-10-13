const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/atom/public.test.js', () => {

  it('action:public', async () => {
    const result = await app.httpRequest().post(mockUrl('test/atom/public'));
    assert.equal(result.body.code, 0);
  });

});
