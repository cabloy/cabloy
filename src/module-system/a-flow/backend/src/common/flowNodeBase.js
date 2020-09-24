module.exports = class FlowNodeBase {
  constructor(ctx, options) {
    this.ctx = ctx;
    if (options) {
      this.context = options.context;
      this._nodeRef = options.nodeRef;
    }
  }

  async onNodeEnter() {}

};

