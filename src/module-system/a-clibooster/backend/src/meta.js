module.exports = app => {
  // schemas
  const schemas = require('./meta/validation/schemas.js')(app);
  // static
  const staticResources = require('./meta/static/resources.js')(app);
  // cli commands
  const cliCommands = require('./meta/cli/commands.js')(app);
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
