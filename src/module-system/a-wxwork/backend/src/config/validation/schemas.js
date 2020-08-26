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
            ebTitle: 'SendLinkAccountMigration',
          },
        },
      },
      groupFunction: {
        type: 'object',
        ebType: 'group',
        ebTitle: 'Function Group',
        properties: {
          linkContacts: {
            ebType: 'link',
            ebTitle: 'Contacts Management',
            ebParams: {
              href: 'contacts/management',
            },
          },
        },
      },
    },
  };

  return schemas;
};
