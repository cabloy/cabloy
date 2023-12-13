module.exports = ctx => {
  const moduleInfo = module.info;
  class Captcha {
    async verify(context) {
      const { data, dataInput } = context;
      if (!data) ctx.throw.module(moduleInfo.relativeName, 1001);
      if (!dataInput.token || dataInput.token.toLowerCase() !== data.token.toLowerCase()) {
        ctx.throw.module(moduleInfo.relativeName, 1002);
      }
    }
  }
  return Captcha;
};
