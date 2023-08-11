module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats extends app.meta.ModelCache {
    constructor(ctx) {
      super(ctx, {
        table: 'aStats',
        options: {
          disableDeleted: true,
          cacheName: { module: moduleInfo.relativeName, name: 'modelStats' },
        },
      });
    }
  }
  return Stats;
};
