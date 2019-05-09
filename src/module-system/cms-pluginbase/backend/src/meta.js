const blockIFrame = require('./config/block/iframe.js');

module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
      },
    },
    validation: {
      validators: {
        blockIFrame: {
          schemas: 'blockIFrame',
        },
      },
      keywords: {},
      schemas: {
        blockIFrame: schemas.blockIFrame,
      },
    },
    cms: {
      plugin: {
        blocks: {
          iframe: blockIFrame,
        },
      },
    },
  };
  return meta;
};
