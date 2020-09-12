module.exports = app => {
  class Instance extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aInstance', options: { disableDeleted: false, disableInstance: true } });
    }
  }
  return Instance;
};
