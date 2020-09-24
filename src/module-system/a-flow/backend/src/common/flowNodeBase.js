module.exports = class FlowNodeBase {
  constructor(ctx, options) {
    this.ctx = ctx;
    if (options) {
      this.context = options.context;
      this._nodeRef = options.nodeRef;
    }
  }

  async onNodeEnter() {
    if (this.context._flowListener.onNodeEnter) {
      await this.context._flowListener.onNodeEnter();
    }
    return true;
  }

  async onNodeBegin() {
    if (this.context._flowListener.onNodeBegin) {
      await this.context._flowListener.onNodeBegin();
    }
    return true;
  }

  async onNodeDoing() {
    if (this.context._flowListener.onNodeDoing) {
      await this.context._flowListener.onNodeDoing();
    }
    return true;
  }

  async onNodeEnd() {
    if (this.context._flowListener.onNodeEnd) {
      await this.context._flowListener.onNodeEnd();
    }
    return true;
  }

  async onNodeLeave() {
    if (this.context._flowListener.onNodeLeave) {
      await this.context._flowListener.onNodeLeave();
    }
    return true;
  }

};

