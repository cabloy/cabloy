const vm = require('vm');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowContext {
    constructor({ flowDefKey, flowDef }) {
      this._flowDefKey = flowDefKey;
      this._flowDef = flowDef;
      // content
      this._flowDefContent = JSON.parse(this._flowDef.content);
      // listener
      this._initFlowListener();
    }

    async start(options) {
      if (!options) options = {};
      const startEventId = options.startEventId;
      // node: startEvent
      const nodeStartEvent = this._findNodeStartEvent({ startEventId });
      if (!nodeStartEvent) throw new Error(`startEvent not found: ${this._flowDefKey}.${startEventId}`);
      // raise event: onFlowStart
      await this._flowListener.onFlowStart(options);
      // raise event: onNodeEnter
      await nodeStartEvent.onNodeEnter();
      console.log('--------done');

    }

    _initFlowListener() {
      // sandbox
      const sandbox = {
        _flowDefKey: this._flowDefKey,
        _flowDef: this._flowDef,
        _flowDefContent: this._flowDefContent,
      };
      this._flowListenerSandbox = vm.createContext(sandbox);
      // class
      const FlowListenerFn = vm.compileFunction(`return ${this._flowDefContent.listener}`, [], { parsingContext: this._flowListenerSandbox });
      // new class
      this._flowListener = new (FlowListenerFn())(this._flowListenerSandbox);
    }

    _findNodeStartEvent({ startEventId }) {
      const nodeRef = this._flowDefContent.process.nodes.find(node => {
        return (startEventId && startEventId === node.id) || (!startEventId && node.type === 'startEventNone');
      });
      const node = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.node`, {
        context: this, nodeRef,
      });
      return node;
    }


  }

  return FlowContext;
};
