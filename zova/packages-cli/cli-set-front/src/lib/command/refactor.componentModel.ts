export default {
  bean: 'refactor.componentModel',
  info: {
    version: '5.0.0',
    title: 'Cli: Refactor: ComponentModel',
    usage: 'zova :refactor:componentModel componentName modelName [--module=]',
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
            expression: 'arg0',
          },
          required: true,
        },
        modelName: {
          type: 'input',
          message: 'modelName',
          initial: {
            expression: 'arg1',
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
