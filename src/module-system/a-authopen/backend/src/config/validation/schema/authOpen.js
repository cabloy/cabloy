module.exports = app => {
  const schemas = {};
  // authOpen
  schemas.authOpen = {
    type: 'object',
    properties: {
      // title
      __groupTitle: {
        ebType: 'group-flatten',
        ebTitle: 'Title',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      scopeRoleId: {
        type: 'number',
        ebType: 'role',
        ebTitle: 'Scope',
        ebParams: {
          roleIdStart: null,
          multiple: false,
          catalogOnly: false,
          leafOnly: true,
          roleTypes: [6],
          mapper: {
            role: 'itemId',
            roleName: 'atomName',
            roleNameLocale: 'atomNameLocale',
          },
        },
      },
      // Auth Info
      __groupAuthInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Authh Info',
      },
    },
  };
  // authOpen search
  schemas.authOpenSearch = {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};
