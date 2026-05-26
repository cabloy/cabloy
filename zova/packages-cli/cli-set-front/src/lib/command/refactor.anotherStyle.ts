export default {
  bean: 'refactor.anotherStyle',
  info: {
    version: '5.0.0',
    title: 'Cli: Refactor: Another Style',
    usage: 'zova :refactor:anotherStyle componentName styleName [--module=]',
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
        styleName: {
          type: 'input',
          message: 'styleName',
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
