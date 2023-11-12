const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe.skip('test/controller/test.test.js', () => {
  // atomClass info
  const atomClass = {
    module: 'cms-sitecommunity',
    atomClassName: 'post',
  };

  it('action:set config', async () => {
    // ctx
    const ctx = await app.mockCtx();

    // login as root
    await ctx.meta.mockUtil.login({ auth: 'root' });

    await ctx.meta.util.performAction({
      innerAccess: false,
      method: 'post',
      url: mockUrl('/a/cms/site/setConfigSite', false),
      body: {
        atomClass,
        data: {
          host: {
            url: 'http://localhost:9081',
            rootPath: '',
          },
          language: {
            default: 'en-us',
            items: 'en-us,zh-cn',
          },
          themes: {
            'en-us': 'cms-themecommunity',
            'zh-cn': 'cms-themecommunity',
          },
        },
      },
    });
  });

  it('action:build languages', async () => {
    // ctx
    const ctx = await app.mockCtx();

    // login as root
    await ctx.meta.mockUtil.login({ auth: 'root' });

    const data = await ctx.meta.util.performAction({
      innerAccess: false,
      method: 'post',
      url: mockUrl('/a/cms/site/buildLanguages', false),
      body: {
        atomClass,
      },
    });
    console.log('time used: ', data.time);
  });

  it('action:render article(cms-sitecommunity)', async () => {
    // ctx
    const ctx = await app.mockCtx();

    // login as root
    await ctx.meta.mockUtil.login({ auth: 'root' });

    const articles = [
      {
        special: true,
        atomName: 'only for test',
        atomLanguage: 'en-us',
        editMode: 1,
      },
      {
        atomName: 'CabloyJS Changelog',
        atomLanguage: 'en-us',
        categoryName: 'Announcement',
        slug: 'changelog',
        editMode: 1,
        content: `
  ## CabloyJS Changelog
        `,
      },
      {
        atomName: 'Welcome to CabloyJS Community',
        atomLanguage: 'en-us',
        categoryName: 'Announcement',
        editMode: 1,
        content: `
  ## You are welcome
        `,
      },
      {
        atomName: 'CabloyJS修改记录',
        atomLanguage: 'zh-cn',
        editMode: 1,
      },
    ];
    for (const article of articles) {
      // create
      const keyDraft = await ctx.meta.util.performAction({
        innerAccess: false,
        method: 'post',
        url: '/a/base/atom/write',
        body: {
          atomClass,
          item: {
            atomName: article.atomName,
            atomLanguage: article.atomLanguage,
            editMode: article.editMode,
            content: article.content,
            slug: article.slug,
          },
        },
      });
      assert(!!keyDraft);

      // submit
      const data = await ctx.meta.util.performAction({
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

      // special test
      if (article.special) {
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
      }
    }
  });

  it('action:build languages', async () => {
    // ctx
    const ctx = await app.mockCtx();

    // login as root
    await ctx.meta.mockUtil.login({ auth: 'root' });

    const data = await ctx.meta.util.performAction({
      innerAccess: false,
      method: 'post',
      url: mockUrl('/a/cms/site/buildLanguages', false),
      body: {
        atomClass,
      },
    });
    console.log('time used: ', data.time);
  });
});
