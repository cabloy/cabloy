const schemas = require('./meta/validation/schemas.js');
const iconGroups = require('./meta/icons/groups.js');
const meta = {
  base: {
    atoms: {},
  },
  validation: {
    validators: {},
    keywords: {},
    schemas,
  },
  icon: {
    groups: iconGroups,
  },
};
module.exports = meta;
