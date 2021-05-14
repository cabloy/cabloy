module.exports = app => {
  const keywords = require('./config/validation/keywords.js')(app);
  const schemas = require('./config/validation/schemas.js')(app);
  const socketioHotloadFile = require('./config/socketio/hotloadFile.js')(app);
  const staticFlowDefs = require('./config/static/flowDefs.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  const meta = {
    base: {
      atoms: {
        article: {
          info: {
            bean: 'article',
            title: 'Article',
            tableName: '',
            tableNameModes: {
              default: '',
              full: '',
              search: '',
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
      resources: {
        block: {
          title: 'CMS Block',
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
        article: {
          schemas: 'article',
        },
        articleSearch: {
          schemas: 'articleSearch',
        },
      },
      keywords,
      schemas: {
        article: schemas.article,
        articleSearch: schemas.articleSearch,
      },
    },
    settings: {
      instance: {
        actionPath: 'config/atomClasses',
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
