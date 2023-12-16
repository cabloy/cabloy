module.exports = {
  bean: 'front.renderTableCell',
  resource: {
    atomStaticKey: 'cliCreate',
  },
  info: {
    version: '5.0.0',
    title: 'Cli: Render Table Cell',
    usage: 'npm run cli :front:renderTableCell componentName -- [--module=]',
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
        componentName: {
          type: 'input',
          message: 'componentName',
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
