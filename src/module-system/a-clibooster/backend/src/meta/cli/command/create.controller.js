module.exports = app => {
  return {
    bean: 'create.controller',
    resource: {
      atomStaticKey: 'cliCreate',
    },
    info: {
      version: '4.0.0',
      title: 'Cli: Create Controller',
      usage: 'npm run cli :create:controller controllerName -- [--module=]',
    },
    options: {
      module: {
        description: 'module name',
        type: 'string',
      },
    },
    groups: {
      default: {
        questions: {
          controllerName: {
            type: 'input',
            message: 'controllerName',
            initial: {
              expression: 'context.argv._[0]',
            },
            required: true,
          },
          module: {
            type: 'input',
            message: 'module name',
            required: true,
          },
        },
      },
      controllerInfoAuto: {
        questions: {
          providerId: {
            type: 'input',
            message: 'providerId',
            initial: {
              expression: 'context.argv.module.split("-")[0]',
            },
            silent: true,
          },
          controllerNameCapitalize: {
            type: 'input',
            message: 'controllerNameCapitalize',
            initial: {
              expression:
                'context.argv.controllerName.replace(context.argv.controllerName[0], context.argv.controllerName[0].toUpperCase())',
            },
            silent: true,
          },
        },
      },
    },
  };
};
