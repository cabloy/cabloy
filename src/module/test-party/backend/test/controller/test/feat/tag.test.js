const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe.only('test/controller/test/feat/tag.test.js', () => {

  it('action:tag', async () => {
    const result = await app.httpRequest().post(mockUrl('test/feat/tag'));
    assert(result.body.code === 0);
  });
});
