module.exports = app => {
  class Tag extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCmsTag', options: { disableDeleted: true } });
    }
  }
  return Tag;
};
