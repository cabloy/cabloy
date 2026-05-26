export default {
  bean: 'create.component',
  info: {
    version: '5.0.0',
    title: 'Cli: Create Component',
    usage: 'zova :create:component componentName [--module=] [--boilerplate=]',
  },
  options: {
    module: {
      description: 'module name',
      type: 'string',
    },
    boilerplate: {
      description: 'boilerplate',
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
