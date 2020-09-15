module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Captcha extends ctx.app.meta.BeanModuleBase {

    async verify(context) {
      const { data, dataInput } = context;
      if (!data) ctx.throw.module(moduleInfo.relativeName, 1001);
      if (!dataInput.token || dataInput.token.toLowerCase() !== data.token.toLowerCase()) ctx.throw.module(moduleInfo.relativeName, 1002);
    }

  }
  return Captcha;
};

