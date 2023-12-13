const moduleInfo = module.info;
module.exports = class FlowNodeHistory extends module.app.meta.ModelCache {
  constructor() {
    super({
      table: 'aFlowNodeHistory',
      options: {
        disableDeleted: false,
        cacheName: { module: moduleInfo.relativeName, name: 'modelFlowNodeHistory' },
      },
    });
  }
};
