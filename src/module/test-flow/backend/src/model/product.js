module.exports = app => {
  class Product extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'testFlowProduct', options: { disableDeleted: false } });
    }
  }
  return Product;
};
