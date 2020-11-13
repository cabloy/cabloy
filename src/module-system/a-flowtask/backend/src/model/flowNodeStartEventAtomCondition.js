module.exports = app => {
  class FlowNodeStartEventAtomCondition extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowNodeStartEventAtomCondition', options: { disableDeleted: true } });
    }
  }
  return FlowNodeStartEventAtomCondition;
};
