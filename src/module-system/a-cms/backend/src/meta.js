module.exports = app => {
  const keywords = require('./config/validation/keywords.js')(app);
  const schemas = require('./config/validation/schemas.js')(app);
  const socketioHotloadFile = require('./config/socketio/hotloadFile.js')(app);
  const meta = {
    base: {
      atoms: {
        article: {
          info: {
            bean: 'article',
            title: 'Article',
            tableName: 'aCmsArticleView',
            tableNameFull: 'aCmsArticleViewFull',
            tableNameSearch: 'aCmsArticleViewSearch',
            tableNameTag: 'aCmsArticleViewTag',
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
          validator: 'article',
          search: {
            validator: 'articleSearch',
          },
          orders: [
            { name: 'sticky', title: 'Sticky', by: 'desc' },
            { name: 'sorting', title: 'Sorting', by: 'asc' },
          ],
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
