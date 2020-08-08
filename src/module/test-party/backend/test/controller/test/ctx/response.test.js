const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/ctx/response.test.js', () => {

  it('action:response:success', async () => {
    const result = await app.httpRequest().post(mockUrl('test/ctx/response/success')).send();
    const body = result.body;
    assert.equal(body.code, 0);
    assert.equal(body.data.userName, 'zhennann');
  });

  it('action:response:successMore', async () => {
    const page = { index: 0, size: 10 };
    const result = await app.httpRequest().post(mockUrl('test/ctx/response/successMore')).send({
      page,
    });
    const body = result.body;
    assert.equal(body.code, 0);
    assert.equal(body.data.index, 2);
    assert.equal(body.data.finished, true);
    assert.equal(body.data.list.length, 2);
  });

  it('action:response:fail', async () => {
    const result = await app.httpRequest().post(mockUrl('test/ctx/response/fail?locale=zh-cn')).send();
    const body = result.body;
    assert.equal(result.status, 200);
    assert.equal(body.code, 1001);
    assert.equal(body.message, '错误测试');
  });

  it('action:response:throwError', async () => {
    const result = await app.httpRequest().post(mockUrl('test/ctx/response/throwError?locale=zh-cn')).send();
    assert.equal(result.status, 500);
  });

});
