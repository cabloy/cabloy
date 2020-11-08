module.exports = app => {
  class FlowTaskHistory extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowTaskHistory', options: { disableDeleted: false } });
    }
  }
  return FlowTaskHistory;
};
