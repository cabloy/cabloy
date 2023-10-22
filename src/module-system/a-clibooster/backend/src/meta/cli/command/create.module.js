module.exports = app => {
  return {
    bean: 'create.module',
    resource: {
      atomStaticKey: 'cliCreate',
    },
    info: {
      version: '4.0.0',
      title: 'Cli: Create Module',
      usage: 'npm run cli :create:module moduleName -- [--template=] [--suite=] [--force]',
    },
    options: {
      template: {
        description: 'template',
        type: 'string',
      },
      suite: {
        description: 'suite name',
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
            message: 'Specify the module template',
            choices: [
              { name: 'module', message: 'cabloy module template (basic)' },
              { name: 'module-business', message: 'cabloy module template (business)' },
              { name: 'module-icon', message: 'cabloy module template (icon)' },
            ],
          },
        },
      },
      moduleInfo: {
        questions: {
          name: {
            type: 'input',
            message: 'module name',
            initial: {
              expression: 'context.argv._[0]',
            },
            required: true,
          },
          suite: {
            type: 'input',
            message: 'suite name',
          },
          description: {
            type: 'input',
            message: 'module description',
          },
          author: {
            type: 'input',
            message: 'module author',
          },
        },
      },
      atomClassInfo: {
        condition: {
          expression: 'context.argv.template==="module-business" || context.argv.template==="module-business-details"',
        },
        questions: {
          providerId: {
            type: 'input',
            message: 'providerId',
            initial: {
              expression: 'context.argv.name.split("-")[0]',
            },
            required: true,
          },
          atomClassName: {
            type: 'input',
            message: 'atomClassName',
            initial: {
              expression: 'context.argv.name.split("-")[1]',
            },
            required: true,
          },
        },
      },
      atomClassInfoAuto: {
        condition: {
          expression: 'context.argv.template==="module-business" || context.argv.template==="module-business-details"',
        },
        questions: {
          atomClassNameCapitalize: {
            type: 'input',
            message: 'atomClassNameCapitalize',
            initial: {
              expression:
                'context.argv.atomClassName.replace(context.argv.atomClassName[0], context.argv.atomClassName[0].toUpperCase())',
            },
            silent: true,
          },
        },
      },
    },
  };
};
