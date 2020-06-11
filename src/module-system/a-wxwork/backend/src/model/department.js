module.exports = app => {
  class Department extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aWxworkDepartment', options: { disableDeleted: true } });
    }
  }
  return Department;
};
