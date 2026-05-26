export default {
  bean: 'create.project',
  info: {
    version: '5.0.0',
    title: 'Cli: Create Project',
    usage: 'zova :create:project projectName [--template=] [--force]',
  },
  options: {
    template: {
      description: 'template',
      type: 'string',
    },
    force: {
      description: 'force',
      type: 'boolean',
    },
  },
  groups: {
    default: {
      questions: {
        template: {
          type: 'select',
          message: 'Specify the project template',
          choices: [
            { name: 'quasar', message: 'zova + quasar' },
            { name: 'vuetify', message: 'zova + vuetify' },
            { name: 'empty', message: 'zova only' },
          ],
        },
      },
    },
    moduleInfo: {
      questions: {
        name: {
          type: 'input',
          message: 'project name',
          initial: {
            expression: 'arg0',
          },
          required: true,
        },
      },
    },
  },
};
