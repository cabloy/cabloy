export default {
  bean: 'tools.crud',
  info: {
    version: '5.0.0',
    title: 'Cli: Tools: Crud',
    usage:
      'npm run vona :tools:crud resourceName -- [--module=] [--aggregate] [--groupBy=name|description]',
  },
  options: {
    aggregate: {
      description: 'generate a fixed count-all aggregate action',
      type: 'boolean',
    },
    groupBy: {
      description: 'generate count-all groups by name or description (fresh entity only)',
      type: 'string',
    },
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
