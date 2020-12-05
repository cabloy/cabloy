module.exports = app => {
  class Resource extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aResource', options: { disableDeleted: false } });
    }
  }
  return Resource;
};
