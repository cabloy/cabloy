const version = require('./controller/version.js');
const auth = require('./controller/auth.js');

module.exports = [
  { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
  { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
  { method: 'post', path: 'auth/add', controller: auth, middlewares: 'inner' },
  { method: 'post', path: 'auth/signup', controller: auth, middlewares: 'validate',
    meta: { validate: { validator: 'signup' } },
  },
  { method: 'post', path: 'auth/reset', controller: auth, middlewares: 'validate',
    meta: { validate: { validator: 'reset' } },
  },
  { method: 'post', path: 'auth/signin', controller: auth, middlewares: 'captchaVerify' },
];
