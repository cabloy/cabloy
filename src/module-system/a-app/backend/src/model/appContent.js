module.exports = app => {
  class AppContent extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aAppContent', options: { disableDeleted: false } });
    }
  }
  return AppContent;
};
