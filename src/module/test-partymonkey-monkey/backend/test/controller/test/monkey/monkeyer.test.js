const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/monkey/monkeyer.test.js', () => {

  it('action:test', async () => {
    const result = await app.httpRequest().post(mockUrl('/test/party/test/monkey/monkeyee/test'));
    assert.equal(result.body.data.moduleName, 'test-partymonkey');
    assert.equal(result.body.data.monkeyed, true);
  });

});
