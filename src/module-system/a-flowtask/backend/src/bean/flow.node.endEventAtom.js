module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeLeave() {
      await super.onNodeLeave();
      // atom
      const atomId = this.context._flow.flowAtomId;
      if (atomId) {
        // _submitDirect
        await ctx.bean.atom._submitDirect({
          key: { atomId },
          item: this.context._atom,
          user: { id: this.context._atom.userIdUpdated },
        });
      }
      // end
      await this.flowInstance._endFlow({
        flowHandleStatus: 1,
        flowRemark: 'Submitted',
      });
      // also true
      return true;
    }

  }

  return FlowNode;
};
