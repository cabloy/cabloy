module.exports = app => {
  const keywords = require('./config/validation/keywords.js')(app);
  const schemas = require('./config/validation/schemas.js')(app);
  const socketioHotloadFile = require('./config/socketio/hotloadFile.js')(app);
  const staticFlowDefs = require('./config/static/flowDefs.js')(app);
  const meta = {
    base: {
      atoms: {
        article: {
          info: {
            bean: 'article',
            title: 'Article',
            tableName: 'aCmsArticle',
            tableNameModes: {
              default: 'aCmsArticle',
              full: 'aCmsArticleViewFull',
              search: 'aCmsArticleViewSearch',
            },
            language: true,
            category: true,
            tag: true,
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
      },
      statics: {
        'a-flow.flowDef': {
          items: staticFlowDefs,
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
      },
      keywords: {
        'x-slug': keywords.slug,
      },
      schemas: {
        article: schemas.article,
        articleSearch: schemas.articleSearch,
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
