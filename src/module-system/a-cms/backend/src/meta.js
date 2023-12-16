const atomClasses = require('./meta/atomClass/atomClasses.js');
const keywords = require('./meta/validation/keywords.js');
const schemas = require('./meta/validation/schemas.js');
// socketio
const socketioHotloadFile = require('./meta/socketio/hotloadFile.js');
// static
const staticApps = require('./meta/static/apps.js');
const staticFlowDefs = require('./meta/static/flowDefs.js');
const staticResources = require('./meta/static/resources.js');
const staticLayouts = require('./meta/static/layouts.js');
// meta
const meta = {
  base: {
    atoms: atomClasses,
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
module.exports = meta;
