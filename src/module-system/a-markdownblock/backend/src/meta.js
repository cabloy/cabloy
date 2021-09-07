module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {},
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
      schemas,
    },
    markdown: {
      blocks: {
        iframe: {
          validator: 'blockIFrame',
        },
        audio: {
          validator: 'blockAudio',
        },
      },
    },
  };
  return meta;
};
