module.exports = app => {
  return {
    bean: 'token.add',
    resource: {
      atomStaticKey: 'cliToken',
    },
    info: {
      version: '5.0.0',
      title: 'Cli: Add Open Auth Token',
    },
    options: {
      name: {
        description: 'name',
        type: 'string',
      },
      host: {
        description: 'host',
        type: 'string',
      },
      clientID: {
        description: 'clientID',
        type: 'string',
      },
      clientSecret: {
        description: 'clientSecret',
        type: 'string',
      },
    },
    groups: {
      default: {
        description: 'Toke Info',
        questions: {
          name: {
            type: 'input',
            message: 'name',
          },
          host: {
            type: 'input',
            message: 'host',
          },
          clientID: {
            type: 'input',
            message: 'clientID',
          },
          clientSecret: {
            type: 'input',
            message: 'clientSecret',
          },
        },
      },
    },
  };
};
