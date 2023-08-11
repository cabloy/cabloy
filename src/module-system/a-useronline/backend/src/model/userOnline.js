module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
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
