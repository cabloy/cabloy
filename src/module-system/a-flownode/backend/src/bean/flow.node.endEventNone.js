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
        // close draft
        await ctx.bean.atom.closeDraft({
          key: { atomId },
        });
      }
      // end
      await this.flowInstance._endFlow({
        flowHandleStatus: 1,
        flowRemark: null,
      });
      // also true
      return true;
    }

  }

  return FlowNode;
};
