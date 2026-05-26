export default {
  bean: 'refactor.pageParams',
  info: {
    version: '5.0.0',
    title: 'Cli: Refactor: PageParams',
    usage: 'zova :refactor:pageParams pageName [--module=]',
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
