const moduleInfo = module.info;
module.exports = class Flow extends module.app.meta.ModelCache {
  constructor() {
    super({
      table: 'aFlow',
      options: {
        disableDeleted: true,
        cacheName: { module: moduleInfo.relativeName, name: 'modelFlow' },
      },
    });
  }
};
