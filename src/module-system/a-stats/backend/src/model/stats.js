module.exports = app => {
  class Stats extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aStats', options: { disableDeleted: true } });
    }
  }
  return Stats;
};
