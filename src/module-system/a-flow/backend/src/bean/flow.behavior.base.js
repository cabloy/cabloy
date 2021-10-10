module.exports = ctx => {
  class FlowBehavior extends ctx.app.meta.FlowBehaviorBase {
    constructor(options) {
      super(ctx, options);
    }

    async enter() {
      // current
      await this.nodeInstance._setCurrent();
      // raise event: onNodeEnter
      const res = await this.nodeInstance.nodeBaseBean.onNodeEnter();
      await this.nodeInstance._saveVars();
      if (!res) return false;
      return await this.nodeInstance.begin();
    }
  }

  return FlowBehavior;
};
