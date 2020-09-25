module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeLeave() {
      super.onNodeLeave();
      // raise event: onFlowEnd
      await this.flowInstance._flowListener.onFlowEnd();
      // end
      return false;
    }

  }

  return FlowNode;
};
