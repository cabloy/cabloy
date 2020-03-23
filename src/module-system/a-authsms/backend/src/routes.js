const version = require('./controller/version.js');
const captcha = require('./controller/captcha.js');
const auth = require('./controller/auth.js');

module.exports = app => {
  const routes = [
    // version
    { method: 'post', path: 'version/update', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/init', controller: version, middlewares: 'inner' },
    { method: 'post', path: 'version/test', controller: version, middlewares: 'test' },
    // captcha
    { method: 'post', path: 'captcha/sendCode', controller: captcha, middlewares: 'captcha' },
    { method: 'post', path: 'captcha/verify', controller: captcha, middlewares: 'inner' },
    // auth
    { method: 'post', path: 'auth/signin', controller: auth, middlewares: 'captchaVerify',
      meta: {
        captchaVerify: { scene: { name: 'signin' } },
      },
    },
    { method: 'post', path: 'auth/signup', controller: auth, middlewares: 'captchaVerify,validate',
      meta: {
        captchaVerify: {
          scenes: [
            { name: 'signupCode', dataKey: 'captchaCode', fieldKey: 'tokenCode' },
            { name: 'signup', dataKey: 'captcha', fieldKey: 'token' },
          ],
        },
        validate: { validator: 'signup' },
      },
    },
  ];
  return routes;
};
