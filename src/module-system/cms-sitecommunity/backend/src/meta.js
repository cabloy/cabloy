const schemas = require('./meta/validation/schemas.js');
const staticApps = require('./meta/static/apps.js');
const staticFlowDefs = require('./meta/static/flowDefs.js');
const staticLayouts = require('./meta/static/layouts.js');
const staticResources = require('./meta/static/resources.js');
const meta = {
  base: {
    atoms: {
      post: {
        info: {
          bean: 'post',
          title: 'CMSPostTitle',
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
          layout: {
            config: {
              atomList: 'layoutAtomListPost',
            },
          },
          flow: {
            stage: 'draft',
          },
          fields: {
            dicts: {
              atomState: {
                draft: {
                  dictKey: null,
                },
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
            enableOnStatic: null,
            enableOnOpened: null,
            stage: 'draft,formal',
          },
        },
        validator: 'post',
        search: {
          validator: 'postSearch',
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
      'a-baselayout.layout': {
        items: staticLayouts,
      },
      'a-base.resource': {
        items: staticResources,
      },
    },
  },
  validation: {
    validators: {},
    keywords: {},
    schemas: {
      post: schemas.post,
      postSearch: schemas.postSearch,
    },
  },
};
module.exports = meta;
