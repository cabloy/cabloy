export default {
  bean: 'create.mock',
  info: {
    version: '5.0.0',
    title: 'Cli: Create Mock',
    usage: 'zova :create:mock mockName [--module=]',
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
        mockName: {
          type: 'input',
          message: 'mockName',
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
