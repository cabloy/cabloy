module.exports = class FlowEdgeBase {
  constructor(ctx, options) {
    this.ctx = ctx;
    if (options) {
      this.flowInstance = options.flowInstance;
      this.context = options.context;
      this._edgeRef = options.edgeRef;
    }
  }

  async onEdgeEnter() {
    if (this.flowInstance._flowListener.onEdgeEnter) {
      await this.flowInstance._flowListener.onEdgeEnter();
    }
    return true;
  }

  async onEdgeTake() {
    if (this.flowInstance._flowListener.onEdgeTake) {
      await this.flowInstance._flowListener.onEdgeTake();
    }
    return true;
  }

  async onEdgeLeave() {
    if (this.flowInstance._flowListener.onEdgeLeave) {
      await this.flowInstance._flowListener.onEdgeLeave();
    }
    return true;
  }

};

