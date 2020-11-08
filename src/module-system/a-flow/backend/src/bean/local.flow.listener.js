const vm = require('vm');
const require3 = require('require3');
const assert = require3('assert');

module.exports = ctx => {

  class FlowListener {

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
      // sandbox
      let sandbox = {};
      if (ctx.app.meta.isTest || ctx.app.meta.isLocal) {
        sandbox.assert = assert;
        sandbox.console = console;
      } else {
        sandbox.assert = () => {};
        sandbox.console = () => {};
      }
      sandbox = vm.createContext(sandbox);
      // class
      const FlowListenerFn = vm.compileFunction(`return ${listenerContent}`, [], { parsingContext: sandbox });
      // new class
      this._flowListener = new (FlowListenerFn())(this.context);
      return this._flowListener;
    }

    async onFlowStart(options) {
      if (this.flowListener && this.flowListener.onFlowStart) {
        await this.flowListener.onFlowStart(options);
        await this.flowInstance._saveFlowVars();
      }
    }

    async onFlowEnd() {
      if (this.flowListener && this.flowListener.onFlowEnd) {
        await this.flowListener.onFlowEnd();
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

  }

  return FlowListener;
};
