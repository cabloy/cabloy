const moduleInfo = module.info;
module.exports = class FlowHistory extends module.meta.class.ModelCache {
  constructor() {
    super({
      table: 'aFlowHistory',
      options: {
        disableDeleted: false,
        cacheName: { module: moduleInfo.relativeName, name: 'modelFlowHistory' },
      },
    });
  }
};
