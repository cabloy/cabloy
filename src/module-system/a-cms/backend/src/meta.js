module.exports = app => {
  // const moduleInfo = module.info;
  const atomClasses = require('./meta/atomClass/atomClasses.js');
  // keywords
  const keywords = require('./meta/validation/keywords.js')(app);
  // schemas
  const schemas = require('./meta/validation/schemas.js')(app);
  // socketio
  const socketioHotloadFile = require('./meta/socketio/hotloadFile.js')(app);
  // static
  const staticApps = require('./meta/static/apps.js')(app);
  const staticFlowDefs = require('./meta/static/flowDefs.js')(app);
  const staticResources = require('./meta/static/resources.js')(app);
  const staticLayouts = require('./meta/static/layouts.js')(app);
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
  return meta;
};
