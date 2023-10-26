module.exports = app => {
  return {
    bean: 'create.atom',
    resource: {
      atomStaticKey: 'cliCreate',
    },
    info: {
      version: '5.0.0',
      title: 'Cli: Create Atom',
      usage: 'npm run cli :create:atom atomClassName -- [--module=]',
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
          atomClassName: {
            type: 'input',
            message: 'atomClassName',
            initial: {
              expression: 'context.argv._[0]',
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
      atomClassInfoAuto: {
        questions: {
          providerId: {
            type: 'input',
            message: 'providerId',
            initial: {
              expression: 'context.argv.module.split("-")[0]',
            },
            silent: true,
          },
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
