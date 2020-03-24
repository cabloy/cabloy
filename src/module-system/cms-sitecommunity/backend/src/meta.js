module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const atomClass = {
    module: moduleInfo.relativeName,
    atomClassName: 'post',
  };
  const atomClassQuery = `module=${atomClass.module}&atomClassName=${atomClass.atomClassName}`;
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
        post: {
          info: {
            title: 'Post2',
            tableName: 'aCmsArticleView',
            tableNameFull: 'aCmsArticleViewFull',
            tableNameSearch: 'aCmsArticleViewSearch',
            tableNameTag: 'aCmsArticleViewTag',
            flow: 1,
            cms: true,
          },
          actions: {
            publish: {
              code: 101,
              title: 'Publish',
              flag: '1,2',
            },
          },
          flags: {
            1: {
              title: 'Publishing',
            },
            2: {
              title: 'Published',
            },
          },
          validator: 'post',
          search: {
            validator: 'postSearch',
          },
          orders: [
            { name: 'sticky', title: 'Sticky', by: 'desc' },
          ],
        },
      },
      functions: {
        createPost: {
          title: 'Create Post',
          scene: 'create',
          autoRight: 1,
          atomClassName: 'post',
          action: 'create',
          sorting: 2,
          menu: 1,
        },
        listPost: {
          title: 'Post List',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'post',
          action: 'read',
          sorting: 2,
          menu: 1,
        },
        listPostByCategory: {
          title: 'Post List(by Category)',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'post',
          action: 'read',
          sorting: 2,
          menu: 1,
          actionPath: `/a/cms/article/category?${atomClassQuery}`,
        },
      },
    },
    validation: {
      validators: {
        post: {
          schemas: 'post',
        },
        postSearch: {
          schemas: 'postSearch',
        },
      },
      keywords: {},
      schemas: {
        post: schemas.post,
        postSearch: schemas.postSearch,
      },
    },
    settings: {
      instance: {
        actionPath: `/a/cms/config/list?${atomClassQuery}`,
      },
    },
    event: {
      implementations: {
        'a-base:atomClassValidator': 'event/atomClassValidator',
      },
    },
  };
  return meta;
};
