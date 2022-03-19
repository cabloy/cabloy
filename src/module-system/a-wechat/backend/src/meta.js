const authFn = require('./config/passport/auth.js');

module.exports = app => {
  const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {
        authWechat: {
          schemas: 'authWechat',
        },
        authWechatweb: {
          schemas: 'authWechatweb',
        },
        authWechatmini: {
          schemas: 'authWechatmini',
        },
      },
      keywords: {},
      schemas,
    },
    event: {
      declarations: {
        wechatMessage: 'Wechat Message',
        wechatMessageMini: 'Miniprogram Message',
      },
      implementations: {
        'a-base:loginInfo': 'loginInfo',
        'a-base:accountMigration': 'accountMigration',
      },
    },
    auth: authFn,
  };
  return meta;
};
