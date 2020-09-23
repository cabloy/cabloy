module.exports = app => {
  class FlowHistory extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowHistory', options: { disableDeleted: true } });
    }
  }
  return FlowHistory;
};
