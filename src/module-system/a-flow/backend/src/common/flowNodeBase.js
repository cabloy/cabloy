module.exports = class FlowNodeBase {
  constructor(ctx, options) {
    this.ctx = ctx;
    if (options) {
      this.flowInstance = options.flowInstance;
      this.nodeInstance = options.nodeInstance;
      this.context = options.context;
      this.contextNode = options.contextNode;
      this.contextEdge = options.contextEdge;
    }
  }

  getBehaviorDefOptions({ behaviorDefId, options }) {
    return this.flowInstance._flowListener.getBehaviorDefOptions(this.contextNode, { behaviorDefId, options });
  }

  getNodeDefOptions({ options }) {
    return this.flowInstance._flowListener.getNodeDefOptions(this.contextNode, { options });
  }

  async onNodeEnter() {
    await this.flowInstance._flowListener.onNodeEnter(this.contextNode);
    return true;
  }

  async onNodeBegin() {
    await this.flowInstance._flowListener.onNodeBegin(this.contextNode);
    return true;
  }

  async onNodeDoing() {
    await this.flowInstance._flowListener.onNodeDoing(this.contextNode);
    return true;
  }

  async onNodeEnd() {
    await this.flowInstance._flowListener.onNodeEnd(this.contextNode);
    return true;
  }

  async onNodeLeave() {
    await this.flowInstance._flowListener.onNodeLeave(this.contextNode);
    return true;
  }

  async onNodeClear({ options }) {
    await this.flowInstance._flowListener.onNodeClear(this.contextNode, { options });
    return true;
  }

  async onNodeChange({ options }) {
    // should not raise onNodeChange for flowListener
    // await this.flowInstance._flowListener.onNodeChange(this.contextNode, { options });
    return true;
  }
};
