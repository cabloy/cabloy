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
      shareRecordPV: 'Share Record PV',
      shareRecordUV: 'Share Record UV',
    },
  },
};
module.exports = meta;
