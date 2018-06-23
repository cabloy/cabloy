const { app, mockUrl, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test.test.js', () => {

  it('actin:hook echo', async () => {
    app.mockSession({});
    const result = await app.httpRequest().post(mockUrl('test/test'));
    assert(result.body.code === 0);
  });

});
