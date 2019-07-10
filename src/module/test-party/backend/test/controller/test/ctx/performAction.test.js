const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/ctx/performAction.test.js', () => {

  it('action:performAction', async () => {
    const result = await app.httpRequest().post(mockUrl('test/ctx/performAction')).send({
      id: 123,
    });
    assert.equal(result.body.data, 123);
  });
});
