module.exports = app => {
  class Dict extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDict', options: { disableDeleted: false } });
    }
  }
  return Dict;
};
