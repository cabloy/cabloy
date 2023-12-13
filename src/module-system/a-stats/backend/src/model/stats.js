module.exports = app => {
  const moduleInfo = module.info;
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
