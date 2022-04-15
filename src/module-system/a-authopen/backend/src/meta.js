const authFn = require('./config/passport/auth.js');

// actionPathListOpenAuthSelf
const _options = {
  stage: 'formal',
  mine: 1,
};
const actionPathListOpenAuthSelf = `/a/basefront/atom/list?module=a-authopen&atomClassName=authOpen&options=${encodeURIComponent(
  JSON.stringify(_options)
)}`;

module.exports = app => {
  // schemas
  const schemas = require('./config/validation/schemas.js')(app);
  // static
  const staticResources = require('./config/static/resources.js')(app);
  // meta
  const meta = {
    auth: authFn,
    base: {
      atoms: {
        authOpen: {
          info: {
            bean: 'authOpen',
            title: 'Open Auth',
            tableName: 'aAuthOpen',
            simple: true,
            history: false,
            inner: true,
            fields: {
              custom: ['clientID,clientSecret,clientSecretHidden'],
            },
          },
          actions: {},
          validator: 'authOpen',
          search: {
            validator: 'authOpenSearch',
          },
        },
      },
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {
        authOpen: {
          schemas: 'authOpen',
        },
        authOpenSearch: {
          schemas: 'authOpenSearch',
        },
      },
      keywords: {},
      schemas,
    },
    settings: {
      user: {
        actionPath: actionPathListOpenAuthSelf,
      },
    },
    index: {
      indexes: {
        aAuthOpen: 'createdAt,updatedAt,atomId,userId,scopeRoleId',
      },
    },
  };
  return meta;
};
