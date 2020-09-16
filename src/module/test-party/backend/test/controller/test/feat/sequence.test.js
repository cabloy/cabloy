const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/sequence.test.js', () => {

  it('action:sequence', async () => {
    const result = await app.httpRequest().post(mockUrl('test/feat/sequence'));
    assert.equal(result.body.code, 0);
  });
});
