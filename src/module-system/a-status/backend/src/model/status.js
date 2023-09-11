module.exports = app => {
  class Status extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aStatus', options: { disableDeleted: true } });
    }
  }

  return Status;
};
