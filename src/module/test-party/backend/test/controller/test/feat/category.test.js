const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/category.test.js', () => {

  it('action:category', async () => {
    const result = await app.httpRequest().post(mockUrl('test/feat/category'));
    assert(result.body.code === 0);
  });
});
