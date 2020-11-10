module.exports = class FlowNodeBase {
  constructor(ctx, options) {
    this.ctx = ctx;
    if (options) {
      this.flowInstance = options.flowInstance;
      this.nodeInstance = options.nodeInstance;
      this.context = options.context;
      this.contextNode = options.contextNode;
    }
  }

  getNodeRefOptions() {
    // nodeRef
    const nodeRef = this.contextNode._nodeRef;
    // options
    return nodeRef.options || {};
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

};

