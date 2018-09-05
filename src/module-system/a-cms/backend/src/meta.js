module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
        article: {
          info: {
            title: 'Article',
            tableName: 'aCmsArticleView',
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
      keywords: {},
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
  };
  return meta;
};
