const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe.skip('test/controller/test.test.js', () => {
  it('Document', async () => {
    // ctx
    const ctx = await app.mockCtx();

    // atomClass info
    const atomClassModule = mockInfo().relativeName;
    const atomClassName = 'document';
    const atomClass = { module: atomClassModule, atomClassName };

    // login as root
    await ctx.meta.mockUtil.login({ auth: 'root' });

    // create
    const keyDraft = await ctx.meta.util.performAction({
      innerAccess: false,
      method: 'post',
      url: '/a/base/atom/write',
      body: {
        atomClass,
        item: {
          atomName: 'test',
        },
      },
    });
    assert(!!keyDraft);

    // submit
    let data = await ctx.meta.util.performAction({
      innerAccess: false,
      method: 'post',
      url: '/a/base/atom/submit',
      body: {
        key: keyDraft,
        atomClass,
        options: { ignoreFlow: true },
      },
    });
    const keyFormal = data.formal.key;
    assert(!!keyFormal);

    // read
    data = await ctx.meta.util.performAction({
      innerAccess: false,
      method: 'post',
      url: '/a/base/atom/read',
      body: {
        key: keyFormal,
        atomClass,
      },
    });
    assert(!!data);

    // delete
    await ctx.meta.util.performAction({
      innerAccess: false,
      method: 'post',
      url: '/a/base/atom/delete',
      body: {
        key: keyFormal,
        atomClass,
      },
    });
  });
});
