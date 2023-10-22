module.exports = app => {
  return {
    bean: 'store.publish',
    resource: {
      atomStaticKey: 'cliStore',
    },
    info: {
      version: '4.0.0',
      title: 'Cli: Store: Publish',
      usage: 'npm run cli :store:publish [entity1] [entity2] -- [--force=]',
    },
    options: {
      force: {
        description: 'force to publish',
        type: 'boolean',
      },
    },
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
