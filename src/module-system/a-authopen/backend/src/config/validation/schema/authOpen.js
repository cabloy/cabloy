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
          titleAlias: 'Scope',
          roleIdStart: null,
          multiple: false,
          catalogOnly: false,
          leafOnly: true,
          roleTypes: [6],
          mapper: {
            scopeRoleId: 'itemId',
            scopeRoleName: 'atomName',
            scopeRoleNameLocale: 'atomNameLocale',
          },
        },
      },
      neverExpire: {
        type: 'number',
        ebType: 'toggle',
        ebTitle: 'NeverExpire',
      },
      expiredTime: {
        type: ['object', 'null'],
        ebType: 'datePicker',
        ebTitle: 'Expiration Time',
        ebParams: {
          timePicker: true,
          dateFormat: 'YYYY-MM-DD HH:mm:00',
          header: false,
          toolbar: true,
        },
        ebDisplay: {
          expression: '!neverExpire',
          dependencies: ['neverExpire'],
        },
        notEmpty: {
          expression: '!neverExpire',
        },
      },
      // Auth Info
      __groupAuthInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Auth Info',
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
