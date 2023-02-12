module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticApps = require('./config/static/apps.js')(app);
  const staticFlowDefs = require('./config/static/flowDefs.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    base: {
      atoms: {
        document: {
          info: {
            bean: 'document',
            title: 'Document',
            tableName: '',
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
              actionModule: 'a-cms',
              actionComponent: 'action',
              icon: { f7: '::preview' },
              enableOnStatic: true,
              enableOnOpened: true,
              stage: 'draft,formal',
            },
          },
          validator: 'document',
          search: {
            validator: 'documentSearch',
          },
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
      },
    },
    validation: {
      validators: {
        document: {
          schemas: 'document',
        },
        documentSearch: {
          schemas: 'documentSearch',
        },
      },
      keywords: {},
      schemas,
    },
  };
  return meta;
};
