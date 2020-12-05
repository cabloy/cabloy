module.exports = app => {
  class ResourceRole extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aResourceRole', options: { disableDeleted: true } });
    }
  }
  return ResourceRole;
};
