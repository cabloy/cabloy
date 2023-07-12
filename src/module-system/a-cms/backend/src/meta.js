module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const keywords = require('./config/validation/keywords.js')(app);
  const schemas = require('./config/validation/schemas.js')(app);
  const socketioHotloadFile = require('./config/socketio/hotloadFile.js')(app);
  const staticApps = require('./config/static/apps.js')(app);
  const staticFlowDefs = require('./config/static/flowDefs.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  const staticLayouts = require('./config/static/layouts.js')(app);
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
            dict: {
              states: {
                draft: {
                  dictKey: 'a-dictbooster:dictAtomStateDraft',
                },
              },
            },
          },
          actions: {
            preview: {
              code: 101,
              title: 'Preview',
              actionModule: moduleInfo.relativeName,
              actionComponent: 'action',
              icon: { f7: '::preview' },
              enableOnStatic: true,
              enableOnOpened: true,
              stage: 'draft,formal',
            },
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
        'a-app.app': {
          items: staticApps,
        },
        'a-flow.flowDef': {
          items: staticFlowDefs,
        },
        'a-base.resource': {
          items: staticResources,
        },
        'a-baselayout.layout': {
          items: staticLayouts,
        },
      },
    },
    validation: {
      validators: {},
      keywords,
      schemas,
    },
    settings: {
      instance: {
        actionPath: 'config/atomClasses',
      },
    },
    event: {
      implementations: {},
    },
    socketio: {
      messages: {
        hotloadFile: socketioHotloadFile,
      },
    },
  };
  return meta;
};
