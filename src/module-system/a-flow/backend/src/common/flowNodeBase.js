const require3 = require('require3');
const extend = require3('extend2');

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

  getNodeDefOptions() {
    // nodeDef
    const nodeDef = this.contextNode._nodeDef;
    // options
    let options = nodeDef.options || {};
    // default
    const optionsDefault = this.nodeInstance.nodeBase.options.default;
    if (optionsDefault) {
      options = extend(true, {}, optionsDefault, options);
    }
    // listener
    const res = this.flowInstance._flowListener.getNodeDefOptions(this.contextNode, { options });
    if (res) {
      options = res;
    }
    return options;
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

  async onNodeClear(options) {
    await this.flowInstance._flowListener.onNodeClear(this.contextNode, { options });
    return true;
  }
};
