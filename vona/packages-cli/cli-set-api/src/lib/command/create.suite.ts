export default {
  bean: 'create.suite',
  info: {
    version: '5.0.0',
    title: 'Cli: Create Suite',
    usage: 'vona :create:suite suiteName',
  },
  options: {},
  groups: {
    suiteInfo: {
      questions: {
        name: {
          type: 'input',
          message: 'suite name',
          initial: {
            expression: 'arg0',
          },
          required: true,
        },
      },
    },
  },
};
