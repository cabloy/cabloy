const schemas = require('./meta/validation/schemas.js');
const flowBehaviors = require('./meta/flow/behaviors.js');
const meta = {
  base: {
    atoms: {},
  },
  validation: {
    validators: {},
    schemas,
  },
  flow: {
    behaviors: flowBehaviors,
  },
};
module.exports = meta;
