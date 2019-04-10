const utils = require('../../common/utils.js');

module.exports = (options, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function captchaVerify(ctx, next) {
    // cache
    const cache = ctx.cache.db.module(moduleInfo.relativeName);
    // user
    const user = ctx.user.agent;
    // get
    const key = utils.getCacheKey({ user });
    const value = await cache.get(key);
    // verify
    if (ctx.request.body.captcha.code !== value.code) {
      // message
      const message = ctx.text('Mismatch Captcha Code');
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
      throw error;
    }
    // clear
    await cache.remove(key);

    // next
    await next();
  };
};
