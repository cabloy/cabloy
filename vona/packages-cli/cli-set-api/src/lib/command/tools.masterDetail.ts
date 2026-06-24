export default {
  bean: 'tools.masterDetail',
  info: {
    version: '5.0.0',
    title: 'Cli: Tools: Master Detail',
    usage:
      'npm run vona :tools:masterDetail resourceName -- [--module=] [--detailModule=] [--detailResourceName=] [--relationName=] [--fk=] [--detailMode=aggregate|standalone]',
  },
  options: {
    module: {
      description: 'master module relative name, such as training-student',
      type: 'string',
    },
    detailModule: {
      description: 'detail module relative name, such as training-record',
      type: 'string',
    },
    detailResourceName: {
      description: 'detail resource name',
      type: 'string',
    },
    relationName: {
      description: 'master relation name',
      type: 'string',
    },
    fk: {
      description: 'detail foreign key field name',
      type: 'string',
    },
    detailMode: {
      description: 'detail mode: aggregate or standalone',
      type: 'string',
    },
  },
  groups: {
    default: {
      questions: {
        resourceName: {
          type: 'input',
          message: 'master resourceName',
          initial: {
            expression: 'arg0',
          },
          required: true,
        },
        module: {
          type: 'input',
          message: 'master module relative name (for example training-student)',
          required: true,
        },
        detailModule: {
          type: 'input',
          message: 'detail module relative name (for example training-record)',
          required: true,
        },
        detailResourceName: {
          type: 'input',
          message: 'detail resourceName',
          required: true,
        },
        relationName: {
          type: 'input',
          message: 'master relation name',
        },
        fk: {
          type: 'input',
          message: 'detail foreign key field name',
        },
        detailMode: {
          type: 'input',
          message: 'detail mode (aggregate|standalone)',
          initial: 'aggregate',
          required: true,
        },
      },
    },
  },
};
