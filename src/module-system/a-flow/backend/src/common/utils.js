module.exports = ({ ctx, flowInstance }) => {
  class Utils {

    constructor({ context, contextNode, contextEdge }) {
      this.context = context;
      this.contextNode = contextNode;
      this.contextEdge = contextEdge;
    }

    async executeService({ bean, parameter }) {
      const globals = {};
      if (this.contextNode) globals.contextNode = this.contextNode;
      if (this.contextEdge) globals.contextEdge = this.contextEdge;
      return await flowInstance._executeServiceInner({
        bean, parameter, globals,
      });
    }

  }
  return Utils;
};
