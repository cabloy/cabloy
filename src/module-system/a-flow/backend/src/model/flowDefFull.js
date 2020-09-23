module.exports = app => {
  class FlowDefFull extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowDefViewFull', options: { disableDeleted: false } });
    }
  }
  return FlowDefFull;
};
