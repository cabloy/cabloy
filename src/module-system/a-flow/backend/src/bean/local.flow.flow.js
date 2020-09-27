const vm = require('vm');
const VarsFn = require('../common/vars.js');
const UtilsFn = require('../common/utils.js');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowInstance {

    constructor({ flowDef }) {
      // context
      this.context = ctx.bean._newBean(`${moduleInfo.relativeName}.local.context.flow`, {
        flowDef,
      });
      // listener
      this._flowListener = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.listener`, {
        flowInstance: this, context: this.context,
      });
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
      const flowUserId = options.flowUserId || 0;
      // create flow
      const flowId = await this._createFlow({ flowVars, flowUserId });
      // context init
      await this._contextInit({ flowId });
      // raise event: onFlowStart
      await this._flowListener.onFlowStart(options);
      // node: startEvent
      const nodeInstanceStartEvent = await this._findNodeInstanceStartEvent({ startEventId });
      if (!nodeInstanceStartEvent) throw new Error(`startEvent not found: ${this.context._flowDef.flowDefKey}.${startEventId}`);
      // node enter
      await nodeInstanceStartEvent.enter();

      console.log('--------done');
    }

    async continue({}) {
    }

    async nextEdges({ contextNode }) {
      const edgeInstances = await this._findEdgeInstancesNext({ nodeRefId: contextNode._nodeRef.id, contextNode });
      for (const edgeInstance of edgeInstances) {
        // check if end
        if (this.context._flow.flowStatus !== 0) {
          break;
        }
        // enter
        await edgeInstance.enter();
      }
    }

    async nextNode({ contextEdge }) {
      const nodeInstanceNext = await this._findNodeInstanceNext({ nodeRefId: contextEdge._edgeRef.target });
      // enter
      await nodeInstanceNext.enter();
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
      // utils
      this.context._utils = new (UtilsFn({ ctx, flowInstance: this }))({
        context: this.context,
      });
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

    async _endFlow() {
      // raise event: onFlowEnd
      await this._flowListener.onFlowEnd();
      // flow
      this.context._flow.flowStatus = 1;
      await this.modelFlow.update(this.context._flow);
      // flow history
      this.context._flowHistory.flowStatus = this.context._flow.flowStatus;
      await this.modelFlowHistory.update(this.context._flowHistory);
    }

    async _createFlow({ flowVars, flowUserId }) {
      // flow
      const data = {
        flowDefId: this.context._flowDef.atomId,
        flowDefKey: this.context._flowDefKey,
        version: this.context._flowDef.version,
        flowStatus: 0,
        flowVars: JSON.stringify(flowVars),
        flowUserId,
      };
      const res = await this.modelFlow.insert(data);
      const flowId = res.insertId;
      // flowHistory
      data.flowId = flowId;
      await this.modelFlowHistory.insert(data);
      // ok
      return flowId;
    }

    _evaluateExpression({ expression, globals }) {
      const sandbox = Object.assign({ context: this.context }, globals);
      return vm.runInContext(expression, vm.createContext(sandbox));
    }

    async _executeService({ bean, parameterExpression, globals }) {
      let parameter;
      if (parameterExpression !== undefined) {
        parameter = this._evaluateExpression({ expression: parameterExpression, globals });
      }
      return await this._executeServiceInner({ bean, parameter, globals });
    }
    async _executeServiceInner({ bean, parameter, globals }) {
      // bean
      const beanFullName = `${bean.module}.flow.service.${bean.name}`;
      const beanInstance = ctx.bean._getBean(beanFullName);
      if (!beanInstance) throw new Error(`bean not found: ${beanFullName}`);
      if (Object.getPrototypeOf(Object.getPrototypeOf(beanInstance)).constructor.name !== 'FlowServiceBase') {
        throw new Error(`bean should extends FlowServiceBase: ${beanFullName}`);
      }
      // context
      const context = Object.assign({ context: this.context }, globals);
      if (parameter !== undefined) {
        context.parameter = parameter;
      }
      return await beanInstance.execute(context);
    }

    async _createNodeInstance({ nodeRef }) {
      const node = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.node`, {
        flowInstance: this, context: this.context, nodeRef,
      });
      await node.init();
      return node;
    }

    async _createEdgeInstance({ edgeRef, contextNode }) {
      const edge = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.edge`, {
        flowInstance: this, context: this.context, contextNode, edgeRef,
      });
      await edge.init();
      return edge;
    }

    async _findNodeInstanceNext({ nodeRefId }) {
      const nodeRef = this.context._flowDefContent.process.nodes.find(node => {
        return nodeRefId === node.id;
      });
      return await this._createNodeInstance({ nodeRef });
    }

    async _findNodeInstanceStartEvent({ startEventId }) {
      const nodeRef = this.context._flowDefContent.process.nodes.find(node => {
        return (startEventId && startEventId === node.id) || (!startEventId && node.type === 'startEventNone');
      });
      return await this._createNodeInstance({ nodeRef });
    }

    async _findEdgeInstancesNext({ nodeRefId, contextNode }) {
      const edges = [];
      for (const edgeRef of this.context._flowDefContent.process.edges) {
        if (edgeRef.source === nodeRefId) {
          const edge = await this._createEdgeInstance({ edgeRef, contextNode });
          edges.push(edge);
        }
      }
      return edges;
    }


  }

  return FlowInstance;
};
