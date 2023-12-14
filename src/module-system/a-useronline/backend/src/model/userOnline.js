const moduleInfo = module.info;
module.exports = class UserOnline extends module.meta.class.ModelCache {
  constructor() {
    super({
      table: 'aUserOnline',
      options: {
        disableDeleted: false,
        cacheName: { module: moduleInfo.relativeName, name: 'modelUserOnline' },
      },
    });
  }
};
