module.exports = app => {
  class AppMenu extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAppMenu', options: { disableDeleted: false } });
    }
  }
  return AppMenu;
};
