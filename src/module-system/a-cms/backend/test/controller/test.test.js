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
    });
    assert(result.body.code === 0);

  });

  it('action:categories', async () => {
    app.mockSession({});

    // login as root
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      auth: 'root',
      password: '123456',
    });

    const categories = [
      { categoryName: 'test4', language: 'en-us', categoryIdParent: 0, sorting: 1 },
      { categoryName: 'test1', language: 'en-us', categoryIdParent: 0 },
      { categoryName: 'test2', language: 'en-us', categoryIdParent: 0 },
      { categoryName: 'test3', language: 'en-us', categoryIdParent: 'test2' },
      { categoryName: 'testHidden', language: 'en-us', categoryIdParent: 0, hidden: 1 },
      { categoryName: 'testFlag', language: 'en-us', categoryIdParent: 0, flag: 'Flag' },
    ];
    const categoryIds = {};
    for (const item of categories) {
      // add
      let result = await app.httpRequest().post(mockUrl('category/add')).send({
        data: {
          categoryName: item.categoryName,
          language: item.language,
          categoryIdParent: item.categoryIdParent ? categoryIds[item.categoryIdParent] : 0,
        },
      });
      assert(result.body.code === 0);
      categoryIds[item.categoryName] = result.body.data;
      // write
      result = await app.httpRequest().post(mockUrl('category/save')).send({
        categoryId: categoryIds[item.categoryName],
        data: {
          categoryName: item.categoryName,
          flag: item.flag || null,
          hidden: item.hidden || 0,
          sorting: item.sorting || 0,
        },
      });
      assert(result.body.code === 0);
    }

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
        editMode: 1,
      },
      {
        atomName: 'hello world2',
        language: 'en-us',
        categoryName: 'category1',
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

  ::: warning
  <script>window.alert('test');</script>
  :::

  ::: audio
{
  "autoplay": true,
  "audio":
  {
    "name": "Yadikar",
    "url": "https://zhennann.cabloy.org/api/a/file/file/download/9d373acea45549fa9fcd90152c73928f.aac",
    "artist": "Retim",
    "cover": "https://zhennann.cabloy.org/api/a/file/file/download/73878ed9a1ce4100ad32580b0fd98db2.jpg"
  }
}
:::

        `,
      },
      {
        atomName: '你好，世界',
        language: 'zh-cn',
        editMode: 1,
      },
      {
        atomName: '你好，世界2',
        language: 'zh-cn',
        editMode: 1,
      },
    ];
    for (const article of articles) {
      let result;
      // category
      if (article.categoryName) {
        result = await app.httpRequest().post(mockUrl('category/add')).send({
          data: {
            categoryName: article.categoryName,
            language: article.language,
            categoryIdParent: 0,
          },
        });
        article.categoryId = result.body.data;
      }

      // create
      result = await app.httpRequest().post(mockUrl('/a/base/atom/create')).send({
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
          editMode: article.editMode,
          content: article.content,
          categoryId: article.categoryId,
          slug: article.slug,
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

});
