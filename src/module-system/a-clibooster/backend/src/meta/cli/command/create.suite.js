module.exports = {
  bean: 'create.suite',
  resource: {
    atomStaticKey: 'cliCreate',
  },
  info: {
    version: '5.0.0',
    title: 'Cli: Create Suite',
    usage: 'npm run cli :create:suite suiteName',
  },
  options: {},
  groups: {
    suiteInfo: {
      questions: {
        name: {
          type: 'input',
          message: 'suite name',
          initial: {
            expression: 'context.argv._[0]',
          },
          required: true,
        },
        description: {
          type: 'input',
          message: 'suite description',
        },
        author: {
          type: 'input',
          message: 'suite author',
        },
      },
    },
  },
};
