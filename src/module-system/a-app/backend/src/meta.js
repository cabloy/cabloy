const schemas = require('./meta/validation/schemas.js');
// static
const staticApps = require('./meta/static/apps.js');
const staticLayouts = require('./meta/static/layouts.js');
const staticResources = require('./meta/static/resources.js');
const meta = {
  base: {
    atoms: {
      app: {
        info: {
          bean: 'app',
          title: 'App',
          tableName: 'aApp',
          tableNameModes: {
            full: 'aAppViewFull',
          },
          inner: true,
          resource: true,
          language: false,
          category: true,
          tag: false,
          comment: false,
          attachment: false,
          layout: {
            config: {
              atomList: 'layoutAtomListApp',
            },
          },
        },
        actions: {
          write: {
            enableOnStatic: null,
          },
        },
        validator: 'app',
        search: {
          validator: 'appSearch',
        },
      },
    },
    statics: {
      'a-app.app': {
        items: staticApps,
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
    schemas,
  },
  index: {
    indexes: { aApp: 'createdAt,updatedAt,atomId' },
  },
};
module.exports = meta;
