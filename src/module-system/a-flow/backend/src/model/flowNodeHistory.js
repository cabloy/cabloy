module.exports = app => {
  const moduleInfo = module.info;
  class FlowNodeHistory extends app.meta.ModelCache {
    constructor(ctx) {
      super(ctx, {
        table: 'aFlowNodeHistory',
        options: {
          disableDeleted: false,
          cacheName: { module: moduleInfo.relativeName, name: 'modelFlowNodeHistory' },
        },
      });
    }
  }
  return FlowNodeHistory;
};
