const moduleInfo = module.info;
module.exports = class FlowNode extends module.meta.class.ModelCache {
  constructor() {
    super({
      table: 'aFlowNode',
      options: {
        disableDeleted: true,
        cacheName: { module: moduleInfo.relativeName, name: 'modelFlowNode' },
      },
    });
  }
};
