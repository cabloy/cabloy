module.exports = app => {
  return {
    bean: 'store.sync',
    resource: {
      atomStaticKey: 'cliStore',
    },
    info: {
      version: '4.0.0',
      title: 'Cli: Store: Sync',
      usage: 'npm run cli :store:sync [module1] [module2]',
    },
    // options: null,
    groups: {
      default: {
        description: 'CliAuthOpenTokenInfoStoreSync',
        questions: {
          clientID: {
            type: 'input',
            message: 'Client ID',
            required: true,
          },
          clientSecret: {
            type: 'input',
            message: 'Client Secret',
            required: true,
          },
        },
      },
    },
  };
};
