const moduleInfo = module.info;
module.exports = class Status extends module.meta.class.ModelCache {
  constructor() {
    super({
      table: 'aStatus',
      options: {
        disableDeleted: true,
        cacheName: { module: moduleInfo.relativeName, name: 'modelStatus' },
      },
    });
  }
};
