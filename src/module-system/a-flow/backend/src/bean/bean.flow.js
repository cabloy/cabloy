

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Flow {

    async startByKey({ flowDefKey, flowVars }) {
      // fullKey
      const { fullKey } = ctx.bean.flowDef._combineFullKey({ flowDefKey });
      // get flow def
      const flowDef = await ctx.bean.flowDef.getByKey({ flowDefKey });
      if (!flowDef) ctx.throw.module(moduleInfo.relativeName, 1001, fullKey);
      // flowInstance
      const flowInstance = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.flow`, {
        flowDefKey: fullKey,
        flowDef,
      });
      // start
      await flowInstance.start({ flowVars });
      // ok
      return flowInstance;
    }

  }

  return Flow;
};
