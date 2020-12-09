module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const blocks = require('./config/blocks.js')(app);
  const staticResources = require('./config/static/resources.js')(app);
  const meta = {
    base: {
      atoms: {
      },
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {
        blockIFrame: {
          schemas: 'blockIFrame',
        },
        blockAudio: {
          schemas: 'blockAudio',
        },
      },
      keywords: {},
      schemas: {
        blockIFrame: schemas.blockIFrame,
        blockAudio: schemas.blockAudio,
      },
    },
    cms: {
      plugin: {
        blocks,
      },
    },
  };
  return meta;
};
