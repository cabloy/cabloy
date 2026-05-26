export default {
  bean: 'tools.crud',
  info: {
    version: '5.0.0',
    title: 'Cli: Tools: Crud',
    usage: 'vona :tools:crud resourceName [--module=]',
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
        resourceName: {
          type: 'input',
          message: 'resourceName',
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
