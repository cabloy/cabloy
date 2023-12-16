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
      ebTitle: 'AuthorizationScopeTitle',
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
      notEmpty: true,
    },
    neverExpire: {
      type: 'number',
      ebType: 'toggle',
      ebTitle: 'NeverExpire',
    },
    expireTime: {
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
    clientID: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Client ID',
      ebReadOnly: true,
    },
    clientSecret: {
      type: 'string',
      ebType: 'text',
      ebTitle: 'Client Secret',
      ebReadOnly: true,
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
module.exports = schemas;
