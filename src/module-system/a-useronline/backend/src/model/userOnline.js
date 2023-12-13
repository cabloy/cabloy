module.exports = app => {
  const moduleInfo = module.info;
  class UserOnline extends app.meta.ModelCache {
    constructor(ctx) {
      super(ctx, {
        table: 'aUserOnline',
        options: {
          disableDeleted: false,
          cacheName: { module: moduleInfo.relativeName, name: 'modelUserOnline' },
        },
      });
    }
  }
  return UserOnline;
};
