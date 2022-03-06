module.exports = app => {
  const schemas = {};
  // userOnline
  schemas.userOnline = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Username',
        notEmpty: true,
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
      expireTime: {
        type: ['object', 'null'],
        ebType: 'text',
        ebTitle: 'Status',
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
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};
