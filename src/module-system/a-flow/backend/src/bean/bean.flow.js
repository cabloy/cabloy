module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Flow {

    async startInstanceByKey({ flowDefinitionKey }) {
      // get flow definition
      const flowDefinition = await ctx.bean.flowDefinition.getByKey({ flowDefinitionKey });
    }
  }

  return Flow;
};
