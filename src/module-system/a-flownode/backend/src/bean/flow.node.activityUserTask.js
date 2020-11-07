module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeBegin() {
      // super
      await super.onNodeBegin();

      // ok
      return true;
    }
  }

  return FlowNode;
};
