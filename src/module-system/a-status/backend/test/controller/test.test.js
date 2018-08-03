const { app, mockUrl, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test.test.js', () => {

  it('action:status', async () => {
    const result = await app.httpRequest().get(mockUrl('test/status'));
    assert(result.body.code === 0);
  });

});
