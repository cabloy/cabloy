module.exports = app => {
  const keywords = require('./config/validation/keywords.js')(app);
  const schemas = require('./config/validation/schemas.js')(app);
  const socketioHotloadFile = require('./config/socketio/hotloadFile.js')(app);
  const flowDefinitions = require('./config/flow/definitions.js')(app);
  const meta = {
    base: {
      atoms: {
        article: {
          info: {
            bean: 'article',
            title: 'Article',
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
          validator: 'article',
          search: {
            validator: 'articleSearch',
          },
        },
      },
      functions: {
        createArticle: {
          title: 'Create Article',
          scene: 'create',
          autoRight: 1,
          atomClassName: 'article',
          action: 'create',
          sorting: 1,
          menu: 1,
        },
        listArticle: {
          title: 'Article List',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'article',
          action: 'read',
          sorting: 1,
          menu: 1,
        },
        listArticleByCategory: {
          title: 'Article List(by Category)',
          scene: 'list',
          autoRight: 1,
          atomClassName: 'article',
          action: 'read',
          sorting: 1,
          menu: 1,
          actionPath: 'article/category',
        },
      },
      statics: {
        'a-flow.flowDef': {
          items: flowDefinitions,
        },
      },
    },
    validation: {
      validators: {
        article: {
          schemas: 'article',
        },
        articleSearch: {
          schemas: 'articleSearch',
        },
        category: {
          schemas: 'category',
        },
      },
      keywords: {
        'x-slug': keywords.slug,
      },
      schemas: {
        article: schemas.article,
        articleSearch: schemas.articleSearch,
        category: schemas.category,
      },
    },
    settings: {
      instance: {
        actionPath: 'config/list',
      },
    },
    event: {
      implementations: {
      },
    },
    socketio: {
      messages: {
        hotloadFile: socketioHotloadFile,
      },
    },
  };
  return meta;
};
