export default {
  bean: 'create.module',
  info: {
    version: '5.0.0',
    title: 'Cli: Create Module',
    usage: 'vona :create:module moduleName [--suite=] [--force]',
  },
  options: {
    suite: {
      description: 'suite name',
      type: 'string',
    },
    force: {
      description: 'force',
      type: 'boolean',
    },
  },
  groups: {
    default: {
      questions: {
        name: {
          type: 'input',
          message: 'module name',
          initial: {
            expression: 'arg0',
          },
          required: true,
        },
        suite: {
          type: 'input',
          message: 'suite name',
        },
      },
    },
  },
};
