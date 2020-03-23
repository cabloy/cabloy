const CaptchaFn = require('./adapter/captcha.js');

module.exports = (options2, app) => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  return async function captchaVerify(ctx, next, options) {
    // must exists
    const scene = options.scene;
    const scenes = options.scenes;
    if (!scene && !scenes) ctx.throw.module(moduleInfo.relativeName, 1001);

    // scene
    if (scene) {
      await sceneVerify({ ctx, scene });
    } else if (scenes) {
      for (const scene of scenes) {
        await sceneVerify({ ctx, scene });
      }
    }

    // next
    await next();
  };
};

async function sceneVerify({ ctx, scene }) {
  // params
  const module = scene.module || ctx.module.info.relativeName;
  const sceneName = scene.name;
  const captchaData = ctx.request.body[scene.dataKey || 'captcha'];
  const providerInstanceId = captchaData.providerInstanceId;
  const dataInput = captchaData.data;
  // verify
  try {
    const _captcha = new (CaptchaFn(ctx))();
    await _captcha.verify({ module, sceneName, providerInstanceId, dataInput });
  } catch (err) {
    throw combineCaptchaError({
      fieldKey: scene.fieldKey || 'token',
      message: err.message,
    });
  }
}

function combineCaptchaError({ fieldKey, message }) {
  // error
  const error = new Error();
  error.code = 422;
  error.message = [
    {
      keyword: 'x-captcha',
      params: [],
      message,
      dataPath: `/captcha/${fieldKey}`,
      schemaPath: `#/properties/captcha/${fieldKey}/x-captcha`,
    },
  ];
  return error;
}
