const { app, mockUrl, assert } = require('egg-born-mock')(__dirname);

describe('test/service/home.test.js', () => {

  it('index', async () => {
    const ctx = app.mockContext({ mockUrl: mockUrl() });
    const message = await ctx.service.home.index();
    assert(message);
  });

});
