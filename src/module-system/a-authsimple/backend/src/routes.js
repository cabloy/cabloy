const version = require('./controller/version.js');
const auth = require('./controller/auth.js');

module.exports = [
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
  { method: 'post', path: 'auth/add', controller: auth, middlewares: 'inner' },
  { method: 'post', path: 'auth/signin', controller: auth, middlewares: 'captchaVerify' },
  { method: 'post', path: 'auth/signup', controller: auth, middlewares: 'captchaVerify,validate',
    meta: { validate: { validator: 'signup' } },
  },
  { method: 'post', path: 'auth/passwordChange', controller: auth, middlewares: 'captchaVerify,validate',
    meta: { validate: { validator: 'passwordChange' } },
  },
  { method: 'post', path: 'auth/emailConfirm', controller: auth, middlewares: 'validate,mail',
    meta: { validate: { validator: 'emailConfirm' } },
  },
  { method: 'get', path: 'auth/emailConfirmation', controller: auth },

];
