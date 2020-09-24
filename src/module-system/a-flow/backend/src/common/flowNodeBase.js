module.exports = class FlowNodeBase {
  constructor(ctx, options) {
    this.ctx = ctx;
    if (options) {
      this.flowInstance = options.flowInstance;
      this.context = options.context;
      this._nodeRef = options.nodeRef;
    }
  }

  async onNodeEnter() {
    if (this.flowInstance._flowListener.onNodeEnter) {
      await this.flowInstance._flowListener.onNodeEnter();
    }
    return true;
  }

  async onNodeBegin() {
    if (this.flowInstance._flowListener.onNodeBegin) {
      await this.flowInstance._flowListener.onNodeBegin();
    }
    return true;
  }

  async onNodeDoing() {
    if (this.flowInstance._flowListener.onNodeDoing) {
      await this.flowInstance._flowListener.onNodeDoing();
    }
    return true;
  }

  async onNodeEnd() {
    if (this.flowInstance._flowListener.onNodeEnd) {
      await this.flowInstance._flowListener.onNodeEnd();
    }
    return true;
  }

  async onNodeLeave() {
    if (this.flowInstance._flowListener.onNodeLeave) {
      await this.flowInstance._flowListener.onNodeLeave();
    }
    return true;
  }

};

