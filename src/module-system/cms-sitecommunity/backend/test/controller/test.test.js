const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe.skip('test/controller/test.test.js', () => {
  // atomClass info
  const atomClass = {
    module: 'cms-sitecommunity',
    atomClassName: 'post',
  };

  it('action:set config', async () => {
    app.mockSession({});

    // login as root
    await app
      .httpRequest()
      .post(mockUrl('/a/auth/passport/a-authsimple/authsimple'))
      .send({
        data: {
          auth: 'root',
          password: '123456',
        },
      });

    const result = await app
      .httpRequest()
      .post(mockUrl('/a/cms/site/setConfigSite'))
      .send({
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
      });
    assert(result.body.code === 0);
  });

  it('action:build languages', async () => {
    app.mockSession({});

    // login as root
    await app
      .httpRequest()
      .post(mockUrl('/a/auth/passport/a-authsimple/authsimple'))
      .send({
        data: {
          auth: 'root',
          password: '123456',
        },
      });

    const result = await app.httpRequest().post(mockUrl('/a/cms/site/buildLanguages')).send({
      atomClass,
    });
    assert(result.body.code === 0);
    console.log('time used: ', result.body.data.time);
  });

  it('action:render article(cms-sitecommunity)', async () => {
    app.mockSession({});

    // login as root
    await app
      .httpRequest()
      .post(mockUrl('/a/auth/passport/a-authsimple/authsimple'))
      .send({
        data: {
          auth: 'root',
          password: '123456',
        },
      });

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
      let result;
      // create
      result = await app
        .httpRequest()
        .post(mockUrl('/a/base/atom/write'))
        .send({
          atomClass,
          item: {
            atomName: article.atomName,
            atomLanguage: article.atomLanguage,
            editMode: article.editMode,
            content: article.content,
            slug: article.slug,
          },
        });
      assert(result.body.code === 0);
      const keyDraft = result.body.data;

      // submit
      result = await app
        .httpRequest()
        .post(mockUrl('/a/base/atom/submit'))
        .send({
          key: keyDraft,
          atomClass,
          options: { ignoreFlow: true },
        });
      assert(result.body.code === 0);
      const keyFormal = result.body.data.formal.key;

      // special test
      if (article.special) {
        // delete
        result = await app.httpRequest().post(mockUrl('/a/base/atom/delete')).send({
          key: keyFormal,
        });
        assert(result.body.code === 0);
      }
    }
  });

  it('action:build languages', async () => {
    app.mockSession({});

    // login as root
    await app
      .httpRequest()
      .post(mockUrl('/a/auth/passport/a-authsimple/authsimple'))
      .send({
        data: {
          auth: 'root',
          password: '123456',
        },
      });

    const result = await app.httpRequest().post(mockUrl('/a/cms/site/buildLanguages')).send({
      atomClass,
    });
    assert(result.body.code === 0);
    console.log('time used: ', result.body.data.time);
  });
});
