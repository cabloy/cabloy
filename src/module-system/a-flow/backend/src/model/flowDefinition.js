module.exports = app => {
  class FlowDefinition extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowDefinition', options: { disableDeleted: false } });
    }
  }
  return FlowDefinition;
};
