const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test.test.js', () => {
  it('action:set config', async () => {
    // ctx
    const ctx = await app.mockCtx();

    // login as root
    await ctx.meta.mockUtil.login({ auth: 'root' });

    await ctx.meta.util.performAction({
      innerAccess: false,
      method: 'post',
      url: mockUrl('site/setConfigSite', false),
      body: {
        data: {
          host: {
            url: 'http://localhost:9080',
            rootPath: '',
          },
          language: {
            default: 'en-us',
            items: 'en-us,zh-cn',
          },
          themes: {
            'en-us': 'cms-themeblog',
            'zh-cn': 'cms-themeblog',
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
      url: mockUrl('site/buildLanguages', false),
    });
    console.log('time used: ', data.time);
  });

  it('action:render article(a-cms)', async () => {
    // ctx
    const ctx = await app.mockCtx();

    // login as root
    await ctx.meta.mockUtil.login({ auth: 'root' });

    const articles = [
      {
        special: true,
        atomName: 'hello world',
        atomLanguage: 'en-us',
        editMode: 1,
      },
      {
        atomName: 'hello world2',
        atomLanguage: 'en-us',
        slug: 'about',
        editMode: 1,
        content: `
  ## hello world
  (c)
  \`\`\` js
  var foo = function (bar) {
    return bar++;
  };
  console.log(foo(5));
  \`\`\`

  ::: alert-warning
  <script>window.alert('test');</script>
  :::

  $$$ a-markdownblock:audio
{
  audio: {
    name: 'Yadikar',
    url: 'https://admin2.zhennann.com/api/a/file/file/download/9d373acea45549fa9fcd90152c73928f.aac',
    artist: 'Retim',
    cover: 'https://admin2.zhennann.com/api/a/file/file/download/73878ed9a1ce4100ad32580b0fd98db2.jpg',
  },
  autoplay: false,
  loop: true,
}
  $$$

        `,
      },
      {
        atomName: '你好，世界',
        atomLanguage: 'zh-cn',
        editMode: 1,
      },
      {
        atomName: '你好，世界2',
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
          atomClass: { module: mockInfo().relativeName, atomClassName: 'article' },
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
          atomClass: { module: mockInfo().relativeName, atomClassName: 'article' },
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
          },
        });
      }
    }
  });

  // it('action:build languages', async () => {
  //   app.mockSession({});

  //   // login as root
  //   await app.httpRequest().post(mockUrl('/a/auth/passport/a-authsimple/authsimple')).send({
  //     data: {
  //       auth: 'root',
  //       password: '123456',
  //     },
  //   });

  //   const result = await app.httpRequest().post(mockUrl('site/buildLanguages')).send();
  //   assert(result.body.code === 0);
  //   console.log('time used: ', result.body.data.time);

  // });
});
