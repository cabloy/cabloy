module.exports = [
  {
    method: 'post',
    path: 'auth/signin',
    controller: 'auth',
    middlewares: 'captchaVerify',
    meta: {
      captchaVerify: { scene: { name: 'signin' } },
    },
  },
  {
    method: 'post',
    path: 'auth/signup',
    controller: 'auth',
    middlewares: 'captchaVerify,validate',
    meta: {
      captchaVerify: { scene: { name: 'signup' } },
      validate: { validator: 'signup' },
    },
  },
  {
    method: 'post',
    path: 'auth/passwordChange',
    controller: 'auth',
    middlewares: 'captchaVerify,validate',
    meta: {
      captchaVerify: { scene: { name: 'passwordChange' } },
      validate: { validator: 'passwordChange' },
    },
  },
  {
    method: 'post',
    path: 'auth/passwordForgot',
    controller: 'auth',
    middlewares: 'validate',
    meta: { validate: { validator: 'passwordForgot' } },
  },
  {
    method: 'post',
    path: 'auth/passwordReset',
    controller: 'auth',
    middlewares: 'validate',
    meta: { validate: { validator: 'passwordReset' } },
  },
  {
    method: 'post',
    path: 'auth/emailConfirm',
    controller: 'auth',
    middlewares: 'validate',
    meta: { validate: { validator: 'emailConfirm' } },
  },
  { method: 'get', path: 'auth/emailConfirmation', controller: 'auth' },
  { method: 'post', path: 'auth/checkStatus', controller: 'auth', meta: { auth: { user: true } } },
];
