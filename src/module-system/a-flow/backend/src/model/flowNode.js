module.exports = app => {
  const moduleInfo = module.info;
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
