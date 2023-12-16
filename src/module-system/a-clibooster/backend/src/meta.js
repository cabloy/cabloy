module.exports = app => {
  const schemas = require('./meta/validation/schemas.js');
  // static
  const staticResources = require('./meta/static/resources.js');
  // cli commands
  const cliCommands = require('./meta/cli/commands.js');
  // meta
  const meta = {
    base: {
      atoms: {},
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {},
      keywords: {},
      schemas,
    },
    cli: {
      commands: cliCommands,
    },
  };
  return meta;
};
