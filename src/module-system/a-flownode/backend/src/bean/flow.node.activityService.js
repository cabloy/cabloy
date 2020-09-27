module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeDoing() {
      // super
      await super.onNodeDoing();
      // bean/parameters
      const bean = this.contextNode._nodeRef.options.bean;
      const parameterExpression = this.contextNode._nodeRef.options.parameterExpression;
      await ctx.bean.flow.executeService({
        bean,
        parameterExpression,
        globals: {
          context: this.context,
          contextNode: this.contextNode,
        },
      });
      // ok
      return true;
    }
  }

  return FlowNode;
};
