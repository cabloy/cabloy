module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
