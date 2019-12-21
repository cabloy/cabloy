const authFn = require('./passport/auth.js');

module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
      },
      functions: {
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
    event: {
      declarations: {
        wechatMessage: 'Wechat Message',
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
