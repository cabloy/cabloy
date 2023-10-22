module.exports = app => {
  const schemas = require('./meta/validation/schemas.js')(app);
  const flowBehaviors = require('./meta/flow/behaviors.js')(app);
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
