module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const atomClass = {
    module: moduleInfo.relativeName,
    atomClassName: 'post',
  };
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
        },
      },
      functions: {
        createPost: {
          title: 'Create Post',
          scene: 'create',
          autoRight: 1,
          atomClassName: 'post',
          action: 'create',
          sorting: 1,
          menu: 1,
        },
        listPost: {
          title: 'Post List',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'post',
          action: 'read',
          sorting: 1,
          menu: 1,
        },
        listPostByCategory: {
          title: 'Post List(by category)',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'post',
          action: 'read',
          sorting: 1,
          menu: 1,
          actionPath: 'post/category',
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
        actionPath: `/a/cms/config/list?module=${atomClass.module}&atomClassName=${atomClass.atomClassName}`,
      },
    },
  };
  return meta;
};
