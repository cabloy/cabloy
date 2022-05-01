module.exports = app => {
  class AppFull extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAppViewFull', options: { disableDeleted: false } });
    }
  }
  return AppFull;
};
