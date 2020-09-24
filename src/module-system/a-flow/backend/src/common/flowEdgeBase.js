module.exports = class FlowEdgeBase {
  constructor(ctx, options) {
    this.ctx = ctx;
    if (options) {
      this.context = options.context;
      this._edgeRef = options.edgeRef;
    }
  }

  async onEdgeEnter() {
    if (this.context._flowListener.onEdgeEnter) {
      await this.context._flowListener.onEdgeEnter();
    }
    return true;
  }

  async onEdgeTake() {
    if (this.context._flowListener.onEdgeTake) {
      await this.context._flowListener.onEdgeTake();
    }
    return true;
  }

  async onEdgeLeave() {
    if (this.context._flowListener.onEdgeLeave) {
      await this.context._flowListener.onEdgeLeave();
    }
    return true;
  }

};

