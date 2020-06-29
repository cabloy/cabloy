module.exports = app => {
  class Department extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aDingtalkDepartment', options: { disableDeleted: true } });
    }
  }
  return Department;
};
