const utils = require('../../common/utils.js');

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function captchaVerify(ctx, next) {
    // config
    const config = ctx.config.module(moduleInfo.relativeName);
    // cache
    const cache = ctx.cache.db.module(moduleInfo.relativeName);
    // timeout
    const timeout = config.cache.timeout;
    // user
    const user = ctx.user.agent;
    // get
    const key = utils.getCacheKey({ user });
    const value = await cache.get(key);
    if (!value || !value.code) {
      // error
      throw combineCaptchaError({
        message: ctx.text('Verification code is invalid, please retrieve again'),
      });
    }
    // verify
    if (ctx.request.body.captcha.code !== value.code) {
      // error
      throw combineCaptchaError({
        message: ctx.text('Mismatch Captcha Code'),
      });
    }
    // clear
    // await cache.remove(key);
    value.code = undefined;
    await cache.set(key, value, timeout);

    // next
    await next();
  };
};

function combineCaptchaError({ message }) {
  // error
  const error = new Error();
  error.code = 422;
  error.message = [
    {
      keyword: 'x-captcha',
      params: [],
      message,
      dataPath: '/captcha/code',
      schemaPath: '#/properties/captcha/code/x-captcha',
    },
  ];
  return error;
}
