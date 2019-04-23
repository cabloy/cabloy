module.exports = app => {
  class Progress extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aProgress', options: { disableDeleted: true } });
    }
  }
  return Progress;
};
