module.exports = class FlowEdgeBase {
  constructor(ctx, options) {
    this.ctx = ctx;
    if (options) {
      this.flowInstance = options.flowInstance;
      this.edgeInstance = options.edgeInstance;
      this.context = options.context;
      this.contextNode = options.contextNode;
      this.contextEdge = options.contextEdge;
    }
  }

  async onEdgeEnter() {
    if (this.flowInstance._flowListener.onEdgeEnter) {
      await this.flowInstance._flowListener.onEdgeEnter(this.contextEdge, this.contextNode);
    }
    return true;
  }

  async onEdgeTake() {
    if (this.flowInstance._flowListener.onEdgeTake) {
      await this.flowInstance._flowListener.onEdgeTake(this.contextEdge, this.contextNode);
    }
    return true;
  }

  async onEdgeLeave() {
    // listener
    if (this.flowInstance._flowListener.onEdgeLeave) {
      await this.flowInstance._flowListener.onEdgeLeave(this.contextEdge, this.contextNode);
    }
    // save flowVars
    await this.flowInstance._saveFlowVars();
    // ok
    return true;
  }

};

