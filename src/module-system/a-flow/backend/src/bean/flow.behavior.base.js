module.exports = ctx => {
  class FlowBehavior extends ctx.app.meta.FlowBehaviorBase {
    constructor(options) {
      super(ctx, options);
    }

    getNodeDefOptions({ options }) {
      return this.nodeInstance.nodeBaseBean.getNodeDefOptions(options);
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

    async begin() {
      // raise event: onNodeBegin
      const res = await this.nodeInstance.nodeBaseBean.onNodeBegin();
      await this.nodeInstance._saveVars();
      if (!res) return false;
      return await this.nodeInstance.doing();
    }

    async doing() {
      // raise event: onNodeDoing
      const res = await this.nodeInstance.nodeBaseBean.onNodeDoing();
      await this.nodeInstance._saveVars();
      if (!res) return false;
      return await this.nodeInstance.end();
    }

    async end() {
      // raise event: onNodeEnd
      const res = await this.nodeInstance.nodeBaseBean.onNodeEnd();
      await this.nodeInstance._saveVars();
      if (!res) return false;
      return await this.nodeInstance.leave();
    }

    async leave() {
      // raise event: onNodeLeave
      const res = await this.nodeInstance.nodeBaseBean.onNodeLeave();
      await this.nodeInstance._saveVars();
      if (!res) return false;
      // clear with done
      await this.nodeInstance.clear({ flowNodeHandleStatus: 1 });
      // next
      return await this.flowInstance.nextEdges({ contextNode: this.contextNode });
    }

    async clear({ options }) {
      await this.nodeInstance.nodeBaseBean.onNodeClear(options);
      await this.nodeInstance._clear(options);
    }
  }

  return FlowBehavior;
};
