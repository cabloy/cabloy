const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/event/hello.test.js', () => {

  it('action:event:hello', async () => {
    app.mockSession({});
    const result = await app.httpRequest().post(mockUrl('test/event/hello'));
    assert.equal(result.body.code, 0);
    assert.equal(result.body.data, 'returnValue');
  });

});
