const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe.only('test/controller/test/feat/bean.test.js', () => {
  it('action:bean', async () => {
    const result = await app.httpRequest().get(mockUrl('test/feat/bean'));
    console.log(result);
    assert.equal(result.body.code, 0);
  });

  it('action:bean.local', async () => {
    const result = await app.httpRequest().get(mockUrl('test/feat/bean/local'));
    assert.equal(result.body.code, 0);
  });
});
