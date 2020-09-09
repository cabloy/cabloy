const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/feat/queue.test.js', () => {

  it('action:queue', async () => {
    let result = await app.httpRequest().post(mockUrl('test/feat/pushAsync'));
    assert(result.body.code === 0);

    result = await app.httpRequest().post(mockUrl('test/feat/push'));
    assert(result.body.code === 0);
  });
});
