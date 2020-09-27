

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Flow {

    async startByKey({ flowDefKey, flowVars, flowUserId }) {
      // fullKey
      const { fullKey } = ctx.bean.flowDef._combineFullKey({ flowDefKey });
      // get flow def
      const flowDef = await ctx.bean.flowDef.getByKey({ flowDefKey });
      if (!flowDef) ctx.throw.module(moduleInfo.relativeName, 1001, fullKey);
      return await this._start({ flowDef, flowVars, flowUserId });
    }

    async startById({ flowDefId, flowVars, flowUserId }) {
      // get flow def
      const flowDef = await ctx.bean.flowDef.getById({ flowDefId });
      if (!flowDef) ctx.throw.module(moduleInfo.relativeName, 1001, flowDefId);
      return await this._start({ flowDef, flowVars, flowUserId });
    }

    async _start({ flowDef, flowVars, flowUserId }) {
      // flowInstance
      const flowInstance = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.flow`, {
        flowDef,
      });
      // start
      await flowInstance.start({ flowVars, flowUserId });
      // ok
      return flowInstance;
    }

  }

  return Flow;
};
