module.exports = app => {
  class WxworkDepartment extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aWxworkDepartment', options: { disableDeleted: true } });
    }
  }
  return WxworkDepartment;
};
