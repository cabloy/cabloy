const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/httpLog.test.js', () => {

  it('action:httpLog', async () => {
    const result = await app.httpRequest().post(mockUrl('test/feat/httpLog?name=zhennann')).send({
      sex: 1,
    });
    assert.equal(result.body.code, 0);
  });
});
