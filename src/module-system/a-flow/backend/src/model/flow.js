module.exports = app => {
  const moduleInfo = module.info;
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
