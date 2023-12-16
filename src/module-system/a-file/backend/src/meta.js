const schemas = require('./meta/validation/schemas.js');
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
module.exports = meta;
