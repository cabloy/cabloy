module.exports = app => {
  class LayoutContent extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aLayoutContent', options: { disableDeleted: false } });
    }
  }
  return LayoutContent;
};
