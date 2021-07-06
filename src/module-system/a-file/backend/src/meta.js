module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
    event: {
      declarations: {
        fileUpdateCheck: 'File Update Check',
        fileDownloadCheck: 'File Download Check',
      },
    },
  };
  return meta;
};
