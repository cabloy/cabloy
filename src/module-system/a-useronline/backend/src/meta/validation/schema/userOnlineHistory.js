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
      type: 'number',
      ebType: 'userName',
      ebTitle: 'Username',
    },
    isLogin: {
      type: 'string',
      ebType: 'dict',
      ebTitle: 'LoginType',
      ebParams: {
        dictKey: 'a-useronline:dictLoginType',
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
      type: ['object', 'null'],
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
    userId: {
      type: 'number',
      ebType: 'user',
      ebTitle: 'Username',
      // ebParams: {
      //   target: '_self',
      //   displayName: 'userName',
      //   mapper: {
      //     userName: 'userName',
      //   },
      // },
      ebSearch: {
        ignoreValue: 0,
      },
      ebDisplay: {
        expression: '!_meta.host.container.options.actionLoginLog',
      },
    },
    isLogin: {
      type: 'string',
      ebType: 'dict',
      ebTitle: 'LoginType',
      ebParams: {
        dictKey: 'a-useronline:dictLoginType',
      },
      ebOptionsBlankAuto: true,
    },
  },
};
module.exports = schemas;
