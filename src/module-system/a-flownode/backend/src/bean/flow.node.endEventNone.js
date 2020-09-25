module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeLeave() {
      super.onNodeLeave();
      // end
      await this.flowInstance._endFlow();
      return false;
    }

  }

  return FlowNode;
};
