module.exports = app => {
  const schemas = {};
  // userOnline
  schemas.userOnline = {
    type: 'object',
    properties: {
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        notEmpty: true,
      },
      onlineStatus: {
        type: 'number',
        ebType: 'dict',
        ebTitle: 'Status',
        ebParams: {
          dictKey: 'a-dictbooster:dictOnlineStatus',
        },
      },
      // Online Info
      __groupOnlineInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Online Info',
      },
      loginCount: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'LoginCount',
      },
      onlineCount: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'OnlineCount',
      },
      onlineIPLast: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'OnlineIPLast',
      },
      onlineTimeLast: {
        type: ['object', 'null'],
        ebType: 'text',
        ebTitle: 'OnlineTimeLast',
        ebParams: {
          dateFormat: true,
        },
      },
    },
  };
  // userOnline search
  schemas.userOnlineSearch = {
    type: 'object',
    properties: {
      onlineStatus: {
        type: 'number',
        ebType: 'dict',
        ebTitle: 'Status',
        ebParams: {
          dictKey: 'a-dictbooster:dictOnlineStatus',
        },
        ebOptionsBlankAuto: true,
      },
    },
  };
  return schemas;
};
