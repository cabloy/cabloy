const blocks = require('./config/blocks.js');

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
