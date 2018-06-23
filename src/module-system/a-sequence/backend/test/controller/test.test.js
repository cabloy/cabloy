const { app, mockUrl, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test.test.js', () => {

  it('action:sequence', async () => {
    const result = await app.httpRequest().get(mockUrl('test/sequence'));
    assert(result.body.code === 0);
  });

});
