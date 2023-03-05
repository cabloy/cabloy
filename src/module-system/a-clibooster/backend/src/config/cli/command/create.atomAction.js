module.exports = app => {
  return {
    bean: 'create.atomAction',
    resource: {
      atomStaticKey: 'cliCreate',
    },
    info: {
      version: '4.0.0',
      title: 'Cli: Create Atom Action',
      usage: 'npm run cli :create:atomAction actionName -- [--actionCode=] [--module=] [--atomClassName=]',
    },
    options: {
      actionCode: {
        description: 'action code',
        type: 'number',
      },
      module: {
        description: 'module name',
        type: 'string',
      },
      atomClassName: {
        description: 'atomClass name',
        type: 'string',
      },
    },
    groups: {
      default: {
        questions: {
          actionName: {
            type: 'input',
            message: 'actionName',
            initial: {
              expression: 'context.argv._[0]',
            },
            required: true,
          },
          actionCode: {
            type: 'input',
            message: 'actionCode',
            initial: {
              expression: '101',
            },
            required: true,
          },
          module: {
            type: 'input',
            message: 'moduleName',
            required: true,
          },
          atomClassName: {
            type: 'input',
            message: 'atomClassName',
            required: true,
          },
        },
      },
      actionInfoAuto: {
        questions: {
          actionNameCapitalize: {
            type: 'input',
            message: 'actionNameCapitalize',
            initial: {
              expression:
                'context.argv.actionName.replace(context.argv.actionName[0], context.argv.actionName[0].toUpperCase())',
            },
            silent: true,
          },
        },
      },
    },
  };
};
