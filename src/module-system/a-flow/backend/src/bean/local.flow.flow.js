const vm = require('vm');
const require3 = require('require3');
const assert = require3('assert');
const VarsFn = require('../common/vars.js');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowInstance {

    constructor({ flowDefKey, flowDef }) {
      // context
      this.context = ctx.bean._newBean(`${moduleInfo.relativeName}.local.context.flow`, {
        flowDefKey, flowDef,
      });
      // listener
      this._flowListener = this._initFlowListener();
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
      const flowVars = options.flowVars || {};
      // create flow
      const flowId = await this._createFlow({ flowVars });
      // context init
      await this._contextInit({ flowId });
      // raise event: onFlowStart
      if (this._flowListener.onFlowStart) {
        await this._flowListener.onFlowStart(options);
        await this._saveFlowVars();
      }
      // node: startEvent
      const nodeStartEvent = await this._findNodeStartEvent({ startEventId });
      if (!nodeStartEvent) throw new Error(`startEvent not found: ${this._flowDefKey}.${startEventId}`);
      // node enter
      await nodeStartEvent.enter();

      console.log('--------done');
    }

    async continue({}) {

    }

    async nextEdges({ nodeRef }) {
      const edges = await this._findEdgesNext({ nodeRefId: nodeRef.id });
      for (const edge of edges) {
        await edge.enter();
      }
    }

    async nextNode({ edgeRef }) {
      const nodeNext = await this._findNodeNext({ nodeRefId: edgeRef.target });
      await nodeNext.enter();
    }

    async _contextInit({ flowId }) {
      // flowId
      this.context._flowId = flowId;
      // flow
      this.context._flow = await this.modelFlow.get({ id: flowId });
      this.context._flowHistory = await this.modelFlowHistory.get({ flowId });
      // flowVars
      this.context._flowVars = new (VarsFn())();
      this.context._flowVars._vars = this.context._flow.flowVars ? JSON.parse(this.context._flow.flowVars) : {};
    }

    async _saveFlowVars() {
      if (!this.context._flowVars._dirty) return;
      // flow
      this.context._flow.flowVars = JSON.stringify(this.context._flowVars._vars);
      await this.modelFlow.update(this.context._flow);
      // flow history
      this.context._flowHistory.flowVars = this.context._flow.flowVars;
      await this.modelFlowHistory.update(this.context._flowHistory);
    }

    async _createFlow({ flowVars }) {
      // flow
      const data = {
        flowDefId: this.context._flowDef.atomId,
        flowDefKey: this.context._flowDefKey,
        version: this.context._flowDef.version,
        flowStatus: 0,
        flowVars: JSON.stringify(flowVars),
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
      let sandbox = {};
      if (ctx.app.meta.isTest || ctx.app.meta.isLocal) {
        sandbox.assert = assert;
      }
      sandbox = vm.createContext(sandbox);
      // class
      const FlowListenerFn = vm.compileFunction(`return ${this.context._flowDefContent.listener}`, [], { parsingContext: sandbox });
      // new class
      return new (FlowListenerFn())(this.context);
    }

    async _findEdgesNext({ nodeRefId }) {
      const edges = [];
      for (const edgeRef of this.context._flowDefContent.process.edges) {
        if (edgeRef.source === nodeRefId) {
          const edge = await this._createEdgeBean({ edgeRef });
          edges.push(edge);
        }
      }
      return edges;
    }

    async _createEdgeBean({ edgeRef }) {
      const edge = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.edge`, {
        flowInstance: this, context: this.context, edgeRef,
      });
      await edge.init();
      return edge;
    }

    async _createNodeBean({ nodeRef }) {
      const node = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.node`, {
        flowInstance: this, context: this.context, nodeRef,
      });
      await node.init();
      return node;
    }

    async _findNodeNext({ nodeRefId }) {
      const nodeRef = this.context._flowDefContent.process.nodes.find(node => {
        return nodeRefId === node.id;
      });
      return await this._createNodeBean({ nodeRef });
    }

    async _findNodeStartEvent({ startEventId }) {
      const nodeRef = this.context._flowDefContent.process.nodes.find(node => {
        return (startEventId && startEventId === node.id) || (!startEventId && node.type === 'startEventNone');
      });
      return await this._createNodeBean({ nodeRef });
    }


  }

  return FlowInstance;
};
