// eslint-disable-next-line
const { app, mock, assert } = require('egg-mock/bootstrap');
const parseMockUrl = function() {
  return app.mockUtil.parseUrlFromPackage(__dirname);
};

describe('test/service/home.test.js', () => {

  it('index', async () => {
    const ctx = app.mockContext({ mockUrl: parseMockUrl() });
    const message = await ctx.service.home.index();
    assert(message);
  });

});
