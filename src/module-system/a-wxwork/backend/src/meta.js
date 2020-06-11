const authFn = require('./passport/auth.js');

module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
        contacts: {
          title: 'Contacts Management',
          actionPath: 'settings/contacts',
          sorting: 1,
          menu: 0,
        },
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
    settings: {
      instance: {
        actionPath: 'settings/list',
      },
    },
    event: {
      declarations: {
        wxworkMessage: 'Wechat Work Message',
        wechatMessageMini: 'Miniprogram Message',
      },
      implementations: {
        'a-base:loginInfo': 'event/loginInfo',
      },
    },
    index: {
      indexes: {
        aWechatUser: 'createdAt,updatedAt,openid,unionid',
      },
    },
    auth: authFn(app),
  };
  return meta;
};
