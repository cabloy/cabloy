const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/model.test.js', () => {

  it('action:model', async () => {
    const result = await app.httpRequest().post(mockUrl('test/feat/model'));
    assert.equal(result.body.code, 0);
  });
});
