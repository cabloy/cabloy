module.exports = app => {
  class Flow extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlow', options: { disableDeleted: true } });
    }
  }
  return Flow;
};
