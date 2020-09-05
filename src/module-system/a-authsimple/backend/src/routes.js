module.exports = [
  { method: 'post', path: 'version/update', controller: 'version', middlewares: 'inner' },
  { method: 'post', path: 'version/init', controller: 'version', middlewares: 'inner' },
  { method: 'post', path: 'version/test', controller: 'version', middlewares: 'test' },
  { method: 'post', path: 'auth/add', controller: 'auth', middlewares: 'inner', meta: { auth: { enable: false } } },
  { method: 'post', path: 'auth/signin', controller: 'auth', middlewares: 'captchaVerify',
    meta: {
      captchaVerify: { scene: { name: 'signin' } },
    },
  },
  { method: 'post', path: 'auth/signup', controller: 'auth', middlewares: 'captchaVerify,validate',
    meta: {
      captchaVerify: { scene: { name: 'signup' } },
      validate: { validator: 'signup' },
    },
  },
  { method: 'post', path: 'auth/passwordChange', controller: 'auth', middlewares: 'captchaVerify,validate',
    meta: {
      captchaVerify: { scene: { name: 'passwordChange' } },
      validate: { validator: 'passwordChange' },
    },
  },
  { method: 'post', path: 'auth/passwordForgot', controller: 'auth', middlewares: 'validate',
    meta: { validate: { validator: 'passwordForgot' } },
  },
  { method: 'post', path: 'auth/passwordReset', controller: 'auth', middlewares: 'validate',
    meta: { validate: { validator: 'passwordReset' } },
  },
  { method: 'post', path: 'auth/emailConfirm', controller: 'auth', middlewares: 'validate',
    meta: { validate: { validator: 'emailConfirm' } },
  },
  { method: 'get', path: 'auth/emailConfirmation', controller: 'auth' },

];
