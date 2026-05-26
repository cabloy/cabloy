export default {
  bean: 'refactor.componentSlots',
  info: {
    version: '5.0.0',
    title: 'Cli: Refactor: ComponentSlots',
    usage: 'zova :refactor:componentSlots componentName [--module=]',
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
        module: {
          type: 'input',
          message: 'module name',
          required: true,
        },
      },
    },
  },
};
