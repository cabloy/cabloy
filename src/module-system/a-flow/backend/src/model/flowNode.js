module.exports = app => {
  class FlowNode extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowNode', options: { disableDeleted: true } });
    }
  }
  return FlowNode;
};
