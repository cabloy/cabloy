module.exports = app => {
  class Category extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aCmsCategory', options: { disableDeleted: true } });
    }
  }
  return Category;
};
