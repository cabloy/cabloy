module.exports = {
  bean: 'store.sync',
  resource: {
    atomStaticKey: 'cliStore',
  },
  info: {
    version: '5.0.0',
    title: 'Cli: Store: Sync',
    usage: 'npm run cli :store:sync [entity1] [entity2]',
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
