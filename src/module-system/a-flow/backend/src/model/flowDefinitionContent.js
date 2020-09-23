module.exports = app => {
  class FlowDefinitionContent extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowDefinitionContent', options: { disableDeleted: false } });
    }
  }
  return FlowDefinitionContent;
};
