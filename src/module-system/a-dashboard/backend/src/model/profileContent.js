module.exports = app => {
  class ProfileContent extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDashboardProfileContent', options: { disableDeleted: false } });
    }
  }
  return ProfileContent;
};
