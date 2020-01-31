const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/broadcast.test.js', () => {

  it('action:broadcast', async () => {
    const result = await app.httpRequest().post(mockUrl('test/feat/broadcast/emit'));
    assert(result.body.code === 0);
  });
});
