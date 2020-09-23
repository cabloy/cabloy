module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase(ctx) {

  }

  return FlowNode;
};
