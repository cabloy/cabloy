module.exports = ctx => {
  class FlowEdge extends ctx.app.meta.FlowEdgeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onEdgeEnter() {
      // super
      const res = await super.onEdgeEnter();
      if (!res) return false;
      // check conditionExpression
      const conditionExpression =
        this.contextEdge._edgeDef.options && this.contextEdge._edgeDef.options.conditionExpression;
      // return true on empty/null/undefined
      if (!conditionExpression && conditionExpression !== false) return true;
      if (conditionExpression === false) return false;
      // contextNodePrevious
      const contextNodePrevious = this.contextNode.contextEdge && this.contextNode.contextEdge.contextNode;
      // evaluateExpression
      const resEnter = ctx.bean.flow.evaluateExpression({
        expression: conditionExpression,
        globals: {
          context: this.context,
          contextNode: this.contextNode,
          contextEdge: this.contextEdge,
          contextNodePrevious,
        },
      });
      const debug = ctx.app.bean.debug.get('flow');
      debug(
        'edge %s: edgeRefId:%s, conditionExpression: %s',
        resEnter ? 'enter' : 'block',
        this.contextEdge._edgeDef.id,
        conditionExpression
      );
      return !!resEnter;
    }
  }

  return FlowEdge;
};
