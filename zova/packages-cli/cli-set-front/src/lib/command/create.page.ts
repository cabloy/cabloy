export default {
  bean: 'create.page',
  info: {
    version: '5.0.0',
    title: 'Cli: Create Page TSX Component',
    usage: 'zova :create:page pageName [--module=]',
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
        pageName: {
          type: 'input',
          message: 'pageName',
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
