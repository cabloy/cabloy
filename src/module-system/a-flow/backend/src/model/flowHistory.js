module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
