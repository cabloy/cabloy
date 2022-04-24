module.exports = app => {
  return {
    bean: 'default.list',
    resource: {
      atomStaticKey: 'cliDefaultList',
    },
    info: {
      version: '4.0.0',
      title: 'Cli: Command List',
    },
    options: {
      module: {
        description: 'module',
        type: 'string',
      },
      group: {
        description: 'group',
        type: 'string',
      },
    },
    groups: null,
  };
};
