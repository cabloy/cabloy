module.exports = app => {
  class PurchaseOrder extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'testFlowPurchaseOrder', options: { disableDeleted: false } });
    }
  }
  return PurchaseOrder;
};
