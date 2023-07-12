module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const flowBehaviors = require('./config/flow/behaviors.js')(app);
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
  return meta;
};
