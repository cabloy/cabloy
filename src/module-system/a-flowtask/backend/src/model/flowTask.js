module.exports = app => {
  class FlowTask extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowTask', options: { disableDeleted: true } });
    }
  }
  return FlowTask;
};
