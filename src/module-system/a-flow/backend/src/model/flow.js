module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Flow extends app.meta.ModelCache {
    constructor(ctx) {
      super(ctx, {
        table: 'aFlow',
        options: {
          disableDeleted: true,
          cacheName: { module: moduleInfo.relativeName, name: 'modelFlow' },
        },
      });
    }
  }
  return Flow;
};
