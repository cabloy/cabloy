module.exports = app => {
  class Layout extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aLayout', options: { disableDeleted: false } });
    }
  }
  return Layout;
};
