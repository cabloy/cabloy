module.exports = app => {

  class Role extends app.meta.Model {

    constructor(ctx) {
      super(ctx, { table: 'aRole', options: { disableDeleted: true } });
    }

  }

  return Role;
};
