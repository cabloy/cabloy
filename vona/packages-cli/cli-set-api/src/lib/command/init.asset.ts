export default {
  bean: 'init.asset',
  info: {
    version: '5.0.0',
    title: 'Cli: Init: Asset Resources',
    usage: 'vona :init:asset scene [--module=]',
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
        scene: {
          type: 'input',
          message: 'scene',
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
