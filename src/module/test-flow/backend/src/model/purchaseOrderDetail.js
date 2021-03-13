module.exports = app => {
  class PurchaseOrderDetail extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'testFlowPurchaseOrderDetail', options: { disableDeleted: false } });
    }
  }
  return PurchaseOrderDetail;
};
