module.exports = ctx => {
  class FlowEdge extends ctx.app.meta.FlowEdgeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onEdgeEnter() {
      // super
      await super.onEdgeEnter();
      // check conditionExpression
      const conditionExpression = this.contextEdge._edgeRef.options && this.contextEdge._edgeRef.options.conditionExpression;
      if (conditionExpression === undefined) return true;
      if (!conditionExpression) return false;
      const res = this.flowInstance._evaluateExpression({
        expression: conditionExpression,
        globals: {
          contextNode: this.contextNode,
          contextEdge: this.contextEdge,
        },
      });
      return !!res;
    }

  }

  return FlowEdge;
};
