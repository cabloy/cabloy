module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const atomClass = {
    module: moduleInfo.relativeName,
    atomClassName: 'post',
  };
  const atomClassQuery = `module=${atomClass.module}&atomClassName=${atomClass.atomClassName}`;
  const schemas = require('./config/validation/schemas.js')(app);
  const staticFlowDefs = require('./config/static/flowDefs.js')(app);
  const meta = {
    base: {
      atoms: {
        post: {
          info: {
            bean: 'post',
            title: 'Post2',
            tableName: 'aCmsArticle',
            tableNameModes: {
              default: 'aCmsArticleView',
              full: 'aCmsArticleViewFull',
              search: 'aCmsArticleViewSearch',
              tag: 'aCmsArticleViewTag',
            },
            cms: true,
          },
          actions: {
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
      statics: {
        'a-flow.flowDef': {
          items: staticFlowDefs,
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
        'a-base:atomClassValidator': 'atomClassValidator',
      },
    },
  };
  return meta;
};
