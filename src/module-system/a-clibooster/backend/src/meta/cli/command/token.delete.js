module.exports = app => {
  return {
    bean: 'token.delete',
    resource: {
      atomStaticKey: 'cliToken',
    },
    info: {
      version: '5.0.0',
      title: 'Cli: Delete Open Auth Token',
    },
    options: {
      name: {
        description: 'name',
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
        },
      },
    },
  };
};
