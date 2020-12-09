module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const atomClass = {
    module: moduleInfo.relativeName,
    atomClassName: 'post',
  };
  const atomClassQuery = `module=${atomClass.module}&atomClassName=${atomClass.atomClassName}`;
  const schemas = require('./config/validation/schemas.js')(app);
  const staticFlowDefs = require('./config/static/flowDefs.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  const meta = {
    base: {
      atoms: {
        post: {
          info: {
            bean: 'post',
            title: 'Post2',
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
          validator: 'post',
          search: {
            validator: 'postSearch',
          },
        },
      },
      statics: {
        'a-flow.flowDef': {
          items: staticFlowDefs,
        },
        'a-base.resource': {
          items: staticResources,
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
  };
  return meta;
};
