// eslint-disable-next-line
const { app, mock, assert } = require('egg-mock/bootstrap');
const parseMockUrl = function(url) {
  const prefix = app.mockUtil.parseUrlFromPackage(__dirname);
  return `${prefix}${url}`;
};

describe('test/controller/home.test.js', () => {

  it('action:index', async () => {
    const result = await app.httpRequest().get(parseMockUrl('home/index'));
    assert(result.body.code === 0);
  });

});
