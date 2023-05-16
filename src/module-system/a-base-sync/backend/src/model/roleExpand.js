module.exports = app => {
  class RoleExpand extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aRoleExpand', options: { disableDeleted: true } });
    }
  }

  return RoleExpand;
};
