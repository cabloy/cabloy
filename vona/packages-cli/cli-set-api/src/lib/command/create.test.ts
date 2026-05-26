export default {
  bean: 'create.test',
  info: {
    version: '5.0.0',
    title: 'Cli: Create Test',
    usage: 'vona :create:test name [--module=]',
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
        name: {
          type: 'input',
          message: 'name',
          initial: {
            expression: 'arg0',
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
