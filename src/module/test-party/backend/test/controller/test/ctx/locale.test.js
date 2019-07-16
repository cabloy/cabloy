const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test/ctx/locale.test.js', () => {

  it('action:locale:enus', async () => {
    const result = await app.httpRequest().post(mockUrl('test/ctx/locale/enus'));
    const data = result.body.data;
    assert.equal(data.enus, 'Hello World');
    assert.equal(data.zhcn, '世界您好');
  });

  it('action:locale:zhcn:cookie', async () => {
    const result = await app.httpRequest().post(mockUrl('test/ctx/locale/zhcn'))
      .set('Cookie', [ 'locale=zh-cn' ]);
    const data = result.body.data;
    assert.equal(data.enus, 'Hello World');
    assert.equal(data.zhcn, '世界您好');
  });

  it('action:locale:zhcn:query', async () => {
    const result = await app.httpRequest().post(mockUrl('test/ctx/locale/zhcn?locale=zh-cn'));
    const data = result.body.data;
    assert.equal(data.enus, 'Hello World');
    assert.equal(data.zhcn, '世界您好');
  });

});
