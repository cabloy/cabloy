export default {
  bean: 'refactor.anotherRender',
  info: {
    version: '5.0.0',
    title: 'Cli: Refactor: Another Render',
    usage: 'zova :refactor:anotherRender componentName renderName [--module=]',
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
        renderName: {
          type: 'input',
          message: 'renderName',
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
