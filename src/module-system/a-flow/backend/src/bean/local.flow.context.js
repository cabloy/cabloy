const vm = require('vm');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowContext {

    constructor({ flowDefKey, flowDef }) {
      this._flowId = null;
      this._flowDefKey = flowDefKey;
      this._flowDef = flowDef;
      // content
      this._flowDefContent = JSON.parse(this._flowDef.content);
      // listener
      this._initFlowListener();
    }

    get modelFlow() {
      return ctx.model.module(moduleInfo.relativeName).flow;
    }
    get modelFlowHistory() {
      return ctx.model.module(moduleInfo.relativeName).flowHistory;
    }

    async start(options) {
      if (!options) options = {};
      const startEventId = options.startEventId;
      // create flow
      this._flowId = await this._createFlow();
      // raise event: onFlowStart
      if (this._flowListener.onFlowStart) {
        await this._flowListener.onFlowStart(options);
      }
      // node: startEvent
      const nodeStartEvent = this._findNodeStartEvent({ startEventId });
      if (!nodeStartEvent) throw new Error(`startEvent not found: ${this._flowDefKey}.${startEventId}`);
      // node enter
      await nodeStartEvent.enter();
      console.log('--------done');

    }

    async nextNode({ nodeRef }) {

    }

    async _createFlow() {
      // flow
      const data = {
        flowDefId: this._flowDef.atomId,
        flowDefKey: this._flowDefKey,
        version: this._flowDef.version,
        flowStatus: 0,
      };
      const res = await this.modelFlow.insert(data);
      const flowId = res.insertId;
      // flowHistory
      data.flowId = flowId;
      await this.modelFlowHistory.insert(data);
      // ok
      return flowId;
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
