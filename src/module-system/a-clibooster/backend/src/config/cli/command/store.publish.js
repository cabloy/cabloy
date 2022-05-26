module.exports = app => {
  return {
    bean: 'store.publish',
    resource: {
      atomStaticKey: 'cliStore',
    },
    info: {
      version: '4.0.0',
      title: 'Cli: Store: Publish',
      usage: 'npm run cli :store:publish [module1] [module2]',
    },
    // options: null,
    groups: {
      default: {
        description: 'CliAuthOpenTokenInfoStorePublish',
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
