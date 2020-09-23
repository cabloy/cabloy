module.exports = app => {
  class FlowNodeHistory extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowNodeHistory', options: { disableDeleted: true } });
    }
  }
  return FlowNodeHistory;
};
