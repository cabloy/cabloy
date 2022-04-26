module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const iconGroups = require('./config/icons/groups.js');
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
  return meta;
};
