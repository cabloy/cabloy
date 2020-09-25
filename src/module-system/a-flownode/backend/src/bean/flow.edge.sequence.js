module.exports = ctx => {
  class FlowEdge extends ctx.app.meta.FlowEdgeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onEdgeEnter() {
      // super
      super.onEdgeEnter();
      // check conditionExpression
      const conditionExpression = this.contextEdge._edgeRef.options.conditionExpression;
      const res = this.flowInstance._evaluateExpression(conditionExpression, {
        contextNode: this.contextNode, contextEdge: this.contextEdge,
      });
      return !!res;
    }

  }

  return FlowEdge;
};
