module.exports = app => {
  const schemas = {};
  // userOnlineHistory
  schemas.userOnlineHistory = {
    type: 'object',
    properties: {
      // Basic Info
      __groupBasicInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      userId: {
        ebType: 'userName',
        ebTitle: 'Username',
      },
      isLogin: {
        type: 'string',
        ebType: 'dict',
        ebTitle: 'LoginType',
        ebParams: {
          dictKey: 'a-userOnline:dictLoginType',
          mode: 'select',
        },
      },
      // Online Info
      __groupOnlineInfo: {
        ebType: 'group-flatten',
        ebTitle: 'Online Info',
      },
      onlineIP: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'OnlineIP',
      },
      onlineTime: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'OnlineTime',
        ebParams: {
          dateFormat: true,
        },
      },
    },
  };
  // userOnlineHistory search
  schemas.userOnlineHistorySearch = {
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
