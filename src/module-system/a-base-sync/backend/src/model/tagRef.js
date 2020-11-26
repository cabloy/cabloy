module.exports = app => {
  class TagRef extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aTagRef', options: { disableDeleted: true } });
    }
  }
  return TagRef;
};
