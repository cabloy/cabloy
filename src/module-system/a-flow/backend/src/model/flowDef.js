module.exports = app => {
  class FlowDef extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowDef', options: { disableDeleted: false } });
    }
  }
  return FlowDef;
};
