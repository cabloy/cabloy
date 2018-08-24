const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe.only('test/controller/test.test.js', () => {

  it('action:set config', async () => {
    app.mockSession({});

    // login as root
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'root',
      password: '123456',
    });

    const result = await app.httpRequest().post(mockUrl('site/setConfigSite')).send({
      data: {
        language: {
          default: 'en-us',
          items: 'en-us,zh-cn',
        },
        themes: {
          'en-us': 'cms-themeblog',
          'zh-cn': 'cms-themeblog',
        },
      },
    });
    assert(result.body.code === 0);

  });

  it('action:build languages', async () => {
    app.mockSession({});

    // login as root
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'root',
      password: '123456',
    });

    const result = await app.httpRequest().post(mockUrl('site/buildLanguages')).send();
    assert(result.body.code === 0);
    console.log('time used: ', result.body.data.time);

  });

  it('action:render article', async () => {
    app.mockSession({});

    // login as root
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'root',
      password: '123456',
    });

    const articles = [
      {
        special: true,
        atomName: 'hello world',
        language: 'en-us',
      },
      {
        atomName: 'hello world2',
        language: 'en-us',
      },
      {
        atomName: '你好，世界',
        language: 'zh-cn',
      },
      {
        atomName: '你好，世界2',
        language: 'zh-cn',
      },
    ];
    for (const article of articles) {
      // create
      let result = await app.httpRequest().post(mockUrl('/a/base/atom/create')).send({
        atomClass: { module: mockInfo().relativeName, atomClassName: 'article', atomClassIdParent: 0 },
      });
      assert(result.body.code === 0);
      const atomKey = result.body.data;

      // submit
      result = await app.httpRequest().post(mockUrl('/a/base/atom/submit')).send({
        key: atomKey,
        item: {
          atomName: article.atomName,
          language: article.language,
        },
      });
      assert(result.body.code === 0);

      // publish
      result = await app.httpRequest().post(mockUrl('/a/base/atom/action')).send({
        action: 101,
        key: atomKey,
      });
      assert(result.body.code === 0);

      // special test
      if (article.special) {
        // publish again
        let result = await app.httpRequest().post(mockUrl('/a/base/atom/action')).send({
          action: 101,
          key: atomKey,
        });
        assert(result.body.code === 0);

        // delete
        result = await app.httpRequest().post(mockUrl('/a/base/atom/delete')).send({
          key: atomKey,
        });
        assert(result.body.code === 0);
      }
    }

  });

  it('action:build language', async () => {
    app.mockSession({});

    // login as root
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'root',
      password: '123456',
    });

    const result = await app.httpRequest().post(mockUrl('site/buildLanguage')).send({
      language: 'zh-cn',
    });
    assert(result.body.code === 0);
    console.log('time used: ', result.body.data.time);

  });

});
