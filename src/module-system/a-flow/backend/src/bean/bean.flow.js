module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Flow {

    async startInstanceByKey({ flowDefinitionKey }) {
      // fullKey
      const { fullKey } = ctx.bean.flowDefinition._combineFullKey({ flowDefinitionKey });
      // get flow definition
      const flowDefinition = await ctx.bean.flowDefinition.getByKey({ flowDefinitionKey });
      if (!flowDefinition) ctx.throw.module(moduleInfo.relativeName, 1001, fullKey);
      // start

    }
  }

  return Flow;
};
