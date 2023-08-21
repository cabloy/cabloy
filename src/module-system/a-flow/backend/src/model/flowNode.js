module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNode extends app.meta.ModelCache {
    constructor(ctx) {
      super(ctx, {
        table: 'aFlowNode',
        options: {
          disableDeleted: true,
          cacheName: { module: moduleInfo.relativeName, name: 'modelFlowNode' },
        },
      });
    }
  }
  return FlowNode;
};
