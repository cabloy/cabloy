export default {
  bean: 'refactor.firstRender',
  info: {
    version: '5.0.0',
    title: 'Cli: Refactor: First Render',
    usage: 'zova :refactor:firstRender componentName [--module=]',
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
