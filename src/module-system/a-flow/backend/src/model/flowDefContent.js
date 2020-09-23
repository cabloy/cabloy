module.exports = app => {
  class FlowDefContent extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowDefContent', options: { disableDeleted: false } });
    }
  }
  return FlowDefContent;
};
