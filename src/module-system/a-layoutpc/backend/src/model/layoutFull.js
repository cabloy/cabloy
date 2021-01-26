module.exports = app => {
  class LayoutFull extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aLayoutViewFull', options: { disableDeleted: false } });
    }
  }
  return LayoutFull;
};
