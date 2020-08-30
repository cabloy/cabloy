const { app, mockUrl, mockInfo, assert } = require('egg-born-mock')(__dirname);

describe('test/controller/test.test.js', () => {

  // atomClass info
  const atomClass = {
    module: 'cms-sitecommunity',
    atomClassName: 'post',
  };

  // categoryIds
  const categoryIds = {};

  it('action:set config', async () => {
    app.mockSession({});

    // login as root
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      data: {
        auth: 'root',
        password: '123456',
      },
    });

    const result = await app.httpRequest().post(mockUrl('/a/cms/site/setConfigSite')).send({
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

  it('action:categories', async () => {
    app.mockSession({});

    // login as root
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      data: {
        auth: 'root',
        password: '123456',
      },
    });

    const categories = [
      { categoryName: 'Share', language: 'en-us', categoryIdParent: 0, sorting: 1 },
      { categoryName: 'Answer', language: 'en-us', categoryIdParent: 0, sorting: 2 },
      { categoryName: 'Announcement', language: 'en-us', categoryIdParent: 0, sorting: 3 },
    ];
    for (const item of categories) {
      // add
      let result = await app.httpRequest().post(mockUrl('/a/cms/category/add')).send({
        atomClass,
        data: {
          categoryName: item.categoryName,
          language: item.language,
          categoryIdParent: item.categoryIdParent ? categoryIds[item.categoryIdParent] : 0,
        },
      });
      assert(result.body.code === 0);
      categoryIds[item.categoryName] = result.body.data;
      // write
      result = await app.httpRequest().post(mockUrl('/a/cms/category/save')).send({
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

  it('action:render article', async () => {
    app.mockSession({});

    // login as root
    await app.httpRequest().post(mockUrl('/a/authsimple/passport/a-authsimple/authsimple')).send({
      data: {
        auth: 'root',
        password: '123456',
      },
    });

    const articles = [
      {
        special: true,
        atomName: 'only for test',
        language: 'en-us',
        editMode: 1,
      },
      {
        atomName: 'CabloyJS Changelog',
        language: 'en-us',
        categoryName: 'Announcement',
        slug: 'changelog',
        editMode: 1,
        content: `
  ## CabloyJS Changelog
        `,
      },
      {
        atomName: 'Welcome to CabloyJS Community',
        language: 'en-us',
        categoryName: 'Announcement',
        editMode: 1,
        content: `
  ## You are welcome
        `,
      },
      {
        atomName: 'CabloyJS修改记录',
        language: 'zh-cn',
        editMode: 1,
      },
    ];
    for (const article of articles) {
      let result;
      // category
      if (article.categoryName) {
        article.categoryId = categoryIds[article.categoryName];
      }

      // create
      result = await app.httpRequest().post(mockUrl('/a/base/atom/create')).send({
        atomClass,
      });
      assert(result.body.code === 0);
      const atomKey = result.body.data;

      // submit
      result = await app.httpRequest().post(mockUrl('/a/base/atom/submit')).send({
        key: atomKey,
        item: {
          atomId: atomKey.atomId,
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
