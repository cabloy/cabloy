module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeLeave() {
      await super.onNodeLeave();
      // atom
      if (this.context._flow.flowAtomId) {
        // _submitDirect
        await ctx.bean.atom._submitDirect({
          key: { atomId: this.context._flow.flowAtomId },
          item: this.context._atom,
          user: { id: this.context._atom.userIdUpdated },
        });
      }
      // end
      await this.flowInstance._endFlow();
      // also true
      return true;
    }

  }

  return FlowNode;
};
