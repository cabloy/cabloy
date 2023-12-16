module.exports = {
  bean: 'create.app',
  resource: {
    atomStaticKey: 'cliCreate',
  },
  info: {
    version: '5.0.0',
    title: 'Cli: Create App',
    usage: 'npm run cli :create:app appName -- [--module=]',
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
        appName: {
          type: 'input',
          message: 'appName',
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
  },
};
