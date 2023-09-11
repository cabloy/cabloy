module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Status extends app.meta.ModelCache {
    constructor(ctx) {
      super(ctx, {
        table: 'aStatus',
        options: {
          disableDeleted: true,
          cacheName: { module: moduleInfo.relativeName, name: 'modelStatus' },
        },
      });
    }
  }

  return Status;
};
