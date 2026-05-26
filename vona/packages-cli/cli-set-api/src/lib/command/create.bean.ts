export default {
  bean: 'create.bean',
  info: {
    version: '5.0.0',
    title: 'Cli: Create Bean',
    usage: 'vona :create:bean sceneName beanName [--module=] [--boilerplate=]',
  },
  options: {
    module: {
      alias: 'm',
      description: 'module name',
      type: 'string',
    },
    boilerplate: {
      description: 'boilerplate',
      type: 'string',
    },
  },
  groups: {
    default: {
      questions: {
        sceneName: {
          type: 'input',
          message: 'sceneName',
          initial: {
            expression: 'arg0',
          },
          required: true,
        },
        beanName: {
          type: 'input',
          message: 'beanName',
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
