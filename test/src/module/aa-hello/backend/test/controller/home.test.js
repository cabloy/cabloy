const { app, mockUrl, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/home.test.js', () => {

  it('action:index', async () => {
    const result = await app.httpRequest().get(mockUrl('home/index'));
    assert(result.body.code === 0);
  });

});
