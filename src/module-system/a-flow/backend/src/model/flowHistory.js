const moduleInfo = module.info;
module.exports = class FlowHistory extends moduleInfo.app.meta.ModelCache {
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
