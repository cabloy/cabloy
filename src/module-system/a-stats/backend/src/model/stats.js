const moduleInfo = module.info;
module.exports = class Stats extends module.app.meta.ModelCache {
  constructor() {
    super({
      table: 'aStats',
      options: {
        disableDeleted: true,
        cacheName: { module: moduleInfo.relativeName, name: 'modelStats' },
      },
    });
  }
};
