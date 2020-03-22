const CaptchaFn = require('./adapter/captcha.js');

module.exports = (options2, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function captchaVerify(ctx, next, options) {
    // must exists
    const scene = options.scene;
    if (!scene) ctx.throw.module(moduleInfo.relativeName, 1001);
    // params
    const module = scene.module || ctx.module.info.relativeName;
    const sceneName = scene.name;
    const captchaData = ctx.request.body[options.data || 'captcha'];
    const providerInstanceId = captchaData.providerInstanceId;
    const dataInput = captchaData.data;
    // verify
    try {
      const _captcha = new (CaptchaFn(ctx))();
      await _captcha.verify({ module, sceneName, providerInstanceId, dataInput });
    } catch (err) {
      throw combineCaptchaError({
        message: err.message,
      });
    }
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
      dataPath: '/captcha/token',
      schemaPath: '#/properties/captcha/token/x-captcha',
    },
  ];
  return error;
}
