module.exports = ctx => {
  class FlowBehavior extends ctx.app.meta.FlowBehaviorBase {
    constructor(options) {
      super(ctx, options);
    }

    getBehaviorDefOptions({ behaviorDefId, options }) {
      return this.nodeInstance.nodeBaseBean.getBehaviorDefOptions({ behaviorDefId, options });
    }

    getNodeDefOptions({ options }) {
      return this.nodeInstance.nodeBaseBean.getNodeDefOptions({ options });
    }

    async enter() {
      return await this.nodeInstance.nodeBaseBean.onNodeEnter();
    }

    async begin() {
      return await this.nodeInstance.nodeBaseBean.onNodeBegin();
    }

    async doing() {
      return await this.nodeInstance.nodeBaseBean.onNodeDoing();
    }

    async end() {
      return await this.nodeInstance.nodeBaseBean.onNodeEnd();
    }

    async leave() {
      return await this.nodeInstance.nodeBaseBean.onNodeLeave();
    }

    async clear({ options }) {
      return await this.nodeInstance.nodeBaseBean.onNodeClear({ options });
    }
  }

  return FlowBehavior;
};
