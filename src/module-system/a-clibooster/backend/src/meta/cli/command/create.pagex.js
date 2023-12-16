module.exports = {
  bean: 'create.pagex',
  resource: {
    atomStaticKey: 'cliCreate',
  },
  info: {
    version: '5.0.0',
    title: 'Cli: Create Page JSX Component',
    usage: 'npm run cli :create:pagex pageName -- [--module=]',
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
        pageName: {
          type: 'input',
          message: 'pageName',
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
