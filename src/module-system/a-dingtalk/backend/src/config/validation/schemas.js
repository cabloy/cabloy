module.exports = app => {
  const schemas = {};

  // settings instance
  schemas.settingsInstance = {
    type: 'object',
    properties: {
      groupInfo: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Info Group',
        properties: {
          sendLinkAccountMigration: {
            type: 'boolean',
            ebType: 'toggle',
            ebTitle: 'Account Migration',
            ebHelp: 'Auto Send Link',
          },
        },
      },
    },
  };

  return schemas;
};
