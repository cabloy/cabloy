module.exports = app => {
  const moduleInfo = module.info;
  class FlowHistory extends app.meta.ModelCache {
    constructor(ctx) {
      super(ctx, {
        table: 'aFlowHistory',
        options: {
          disableDeleted: false,
          cacheName: { module: moduleInfo.relativeName, name: 'modelFlowHistory' },
        },
      });
    }
  }
  return FlowHistory;
};
