const assert = require('assert');

module.exports = class FlowListener {
  constructor({ flowInstance, context }) {
    this.flowInstance = flowInstance;
    this.context = context;
    this._flowListener = undefined;
  }

  get flowListener() {
    if (this._flowListener !== undefined) return this._flowListener;
    // content
    const listenerContent = this.context._flowDefContent.listener;
    if (!listenerContent) {
      this._flowListener = null;
      return this._flowListener;
    }
    // script
    const expression = `${listenerContent};\nmodule.exports = new Listener(__contextFlow);`;
    // globals
    const globals = {};
    globals.__contextFlow = this.context;
    globals.assert = {
      equal: (...args) => {
        assert.equal(...args);
      },
    };
    // new class
    this._flowListener = this.ctx.bean.util.evaluateExpression({ expression, globals, wrapper: true });
    return this._flowListener;
  }

  async onFlowStart(options) {
    if (this.flowListener && this.flowListener.onFlowStart) {
      await this.flowListener.onFlowStart(options);
    }
  }

  async onFlowEnd(options) {
    if (this.flowListener && this.flowListener.onFlowEnd) {
      await this.flowListener.onFlowEnd(options);
    }
  }

  async onNodeEnter(contextNode) {
    if (this.flowListener && this.flowListener.onNodeEnter) {
      await this.flowListener.onNodeEnter(contextNode);
    }
  }

  async onNodeBegin(contextNode) {
    if (this.flowListener && this.flowListener.onNodeBegin) {
      await this.flowListener.onNodeBegin(contextNode);
    }
  }

  async onNodeDoing(contextNode) {
    if (this.flowListener && this.flowListener.onNodeDoing) {
      await this.flowListener.onNodeDoing(contextNode);
    }
  }

  async onNodeEnd(contextNode) {
    if (this.flowListener && this.flowListener.onNodeEnd) {
      await this.flowListener.onNodeEnd(contextNode);
    }
  }

  async onNodeLeave(contextNode) {
    if (this.flowListener && this.flowListener.onNodeLeave) {
      await this.flowListener.onNodeLeave(contextNode);
    }
  }

  async onNodeClear(contextNode, { options }) {
    if (this.flowListener && this.flowListener.onNodeClear) {
      await this.flowListener.onNodeClear(contextNode, { options });
    }
  }

  async onEdgeEnter(contextEdge, contextNode) {
    if (this.flowListener && this.flowListener.onEdgeEnter) {
      await this.flowListener.onEdgeEnter(contextEdge, contextNode);
    }
  }

  async onEdgeTake(contextEdge, contextNode) {
    if (this.flowListener && this.flowListener.onEdgeTake) {
      await this.flowListener.onEdgeTake(contextEdge, contextNode);
    }
  }

  async onEdgeLeave(contextEdge, contextNode) {
    if (this.flowListener && this.flowListener.onEdgeLeave) {
      await this.flowListener.onEdgeLeave(contextEdge, contextNode);
    }
  }

  async onTaskCreated(contextTask, contextNode) {
    if (this.flowListener && this.flowListener.onTaskCreated) {
      await this.flowListener.onTaskCreated(contextTask, contextNode);
    }
  }

  async onTaskClaimed(contextTask, contextNode) {
    if (this.flowListener && this.flowListener.onTaskClaimed) {
      await this.flowListener.onTaskClaimed(contextTask, contextNode);
    }
  }

  async onTaskCompleted(contextTask, contextNode) {
    if (this.flowListener && this.flowListener.onTaskCompleted) {
      await this.flowListener.onTaskCompleted(contextTask, contextNode);
    }
  }

  getBehaviorDefOptions(contextNode, { behaviorDefId, options }) {
    if (this.flowListener && this.flowListener.getBehaviorDefOptions) {
      const res = this.flowListener.getBehaviorDefOptions(contextNode, { behaviorDefId, options });
      if (res) return res;
    }
    return options;
  }

  getNodeDefOptions(contextNode, { options }) {
    if (this.flowListener && this.flowListener.getNodeDefOptions) {
      const res = this.flowListener.getNodeDefOptions(contextNode, { options });
      if (res) return res;
    }
    return options;
  }
};
