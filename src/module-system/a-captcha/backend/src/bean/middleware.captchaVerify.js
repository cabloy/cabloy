const moduleInfo = module.info;
module.exports = class Middleware {
  async execute(options, next) {
    // must exists
    const scene = options.scene;
    const scenes = options.scenes;
    if (!scene && !scenes) this.ctx.throw.module(moduleInfo.relativeName, 1001);

    // local.disabled
    if (this.ctx.app.meta.isLocal && this.ctx.config.module(moduleInfo.relativeName).configFront.local.disabled) {
      // next
      return await next();
    }

    // scene
    if (scene) {
      await sceneVerify({ ctx: this.ctx, scene });
    } else if (scenes) {
      for (const scene of scenes) {
        await sceneVerify({ ctx: this.ctx, scene });
      }
    }
    // next
    await next();
  }
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
    await ctx.bean.captcha.verify({ module, sceneName, providerInstanceId, dataInput });
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
  const errMessage = [
    {
      keyword: 'x-captcha',
      params: [],
      message,
      dataPath: `/captcha/${fieldKey}`,
      schemaPath: `#/properties/captcha/${fieldKey}/x-captcha`,
    },
  ];
  error.message = JSON.stringify(errMessage, null, 2);
  return error;
}
