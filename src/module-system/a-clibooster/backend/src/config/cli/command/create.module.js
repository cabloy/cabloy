module.exports = app => {
  return {
    bean: 'create.module',
    resource: {
      atomStaticKey: 'cliCreate',
    },
    info: {
      version: '4.0.0',
      title: 'Cli: Create Module',
      usage: 'npm run cli :create:module modulePath -- [--template=?]',
    },
    options: {
      template: {
        description: 'template',
        type: 'string',
      },
    },
    groups: {
      default: {
        questions: {
          template: {
            type: 'select',
            message: 'Specify the module template',
            choices: [
              { name: 'module', message: 'cabloy module template' },
              { name: 'module-business', message: 'cabloy business module template' },
              { name: 'module-business-details', message: 'cabloy business module template with details' },
              { name: 'module-icon', message: 'cabloy icon module template' },
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
              expression: `
                var modulePath=context.argv._[0];
                if(!modulePath) throw new Error('Please specify the module path');
                modulePath = modulePath.replace(/\\\\/g, '/');
                var pos=modulePath.lastIndexOf('/');
                if(pos===-1) throw new Error('The module path is not valid');
                return modulePath.substring(pos+1);
              `,
            },
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
          expression: 'argv.template==="module-business" || argv.template==="module-business-details"',
        },
        questions: {
          providerId: {
            type: 'input',
            message: 'providerId',
          },
          atomClassName: {
            type: 'input',
            message: 'atomClassName',
          },
        },
      },
    },
  };
};
