const { app, mockUrl, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test.test.js', () => {

  it('action:cachemem', async () => {
    const result = await app.httpRequest().get(mockUrl('test/cachemem'));
    assert(result.body.code === 0);
  });

  it('action:cachedb', async () => {
    const result = await app.httpRequest().get(mockUrl('test/cachedb'));
    assert(result.body.code === 0);
  });

});
