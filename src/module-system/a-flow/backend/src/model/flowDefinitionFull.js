module.exports = app => {
  class FlowDefinitionFull extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowDefinitionViewFull', options: { disableDeleted: false } });
    }
  }
  return FlowDefinitionFull;
};
