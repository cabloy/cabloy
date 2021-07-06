module.exports = ({ ctx /* flowInstance*/ }) => {
  class Utils {
    constructor({ context, contextNode, contextTask }) {
      this.context = context;
      this.contextNode = contextNode;
      this.contextTask = contextTask;
    }

    async executeService({ bean, parameter }) {
      const globals = {};
      if (this.context) globals.context = this.context;
      if (this.contextNode) globals.contextNode = this.contextNode;
      if (this.contextTask) globals.contextTask = this.contextTask;
      return await ctx.bean.flow.executeService({
        bean,
        parameter,
        globals,
      });
    }
  }
  return Utils;
};
