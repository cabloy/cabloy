const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('[your tests start from here]', () => {
  it('[atom]', async () => {
    // ctx
    const ctx = await app.mockCtx();

    // atomClass
    const atomClassModule = mockInfo().relativeName;
    const atomClassName = '<%=argv.atomClassName%>';
    const atomClass = { module: atomClassModule, atomClassName };

    // login as root
    await ctx.meta.util.performAction({
      method: 'post',
      url: '/a/auth/passport/a-authsimple/authsimple',
      body: {
        data: {
          auth: 'root',
          password: '123456',
        },
      },
    });

    // create
    const keyDraft = await ctx.meta.util.performAction({
      method: 'post',
      url: '/a/base/atom/write',
      body: {
        atomClass,
        item: {
          atomName: 'test',
          description: 'this is a test',
        },
      },
    });
    assert(!!keyDraft);

    // submit
    let result = await ctx.meta.util.performAction({
      method: 'post',
      url: '/a/base/atom/submit',
      body: {
        key: keyDraft,
        atomClass,
      },
    });
    const keyFormal = result.formal.key;
    assert(!!keyFormal);

    // read
    result = await ctx.meta.util.performAction({
      method: 'post',
      url: '/a/base/atom/read',
      body: {
        key: keyFormal,
        atomClass,
      },
    });
    assert(!!result);

    // delete
    await ctx.meta.util.performAction({
      method: 'post',
      url: '/a/base/atom/delete',
      body: {
        key: keyFormal,
        atomClass,
      },
    });
  });
});
