module.exports = app => {
  class ProfileFull extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDashboardProfileViewFull', options: { disableDeleted: false } });
    }
  }
  return ProfileFull;
};
