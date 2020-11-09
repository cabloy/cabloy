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

    get modelAtom() {
      return ctx.model.module('a-base').atom;
    }
    get modelFlow() {
      return ctx.model.module(moduleInfo.relativeName).flow;
    }
    get modelFlowHistory() {
      return ctx.model.module(moduleInfo.relativeName).flowHistory;
    }
    get constant() {
      return ctx.constant.module(moduleInfo.relativeName);
    }

    async start({ flowAtomId, flowVars, flowUserId, startEventId }) {
      if (!flowVars) flowVars = {};
      if (flowUserId === undefined) flowUserId = 0;
      // create flow
      const flowId = await this._createFlow({ flowAtomId, flowVars, flowUserId });
      // context init
      await this._contextInit({ flowId });
      // raise event: onFlowStart
      await this._flowListener.onFlowStart({ flowVars, flowUserId, startEventId });
      await this._saveFlowVars();
      // node: startEvent
      const nodeInstanceStartEvent = await this._findNodeInstanceStartEvent({ startEventId });
      if (!nodeInstanceStartEvent) throw new Error(`startEvent not found: ${this.context._flowDef.flowDefKey}.${startEventId || 'startEventNone'}`);
      // node enter
      const res = await nodeInstanceStartEvent.enter();
      if (!res) {
        console.log(`--------flow break: ${flowId}`);
      }
    }

    async _load({ flow }) {
      // context init
      await this._contextInit({ flowId: flow.id });
    }

    async nextEdges({ contextNode }) {
      const edgeInstances = await this._findEdgeInstancesNext({ nodeRefId: contextNode._nodeRef.id, contextNode });
      if (edgeInstances.length === 0) return true;
      for (const edgeInstance of edgeInstances) {
        // check if end
        if (this.context._flow.flowStatus !== this.constant.flow.status.flowing) {
          return true;
        }
        // enter
        const res = await edgeInstance.enter();
        if (res) {
          return true;
        }
      }
      return false;
    }

    async nextNode({ contextEdge }) {
      const nodeInstanceNext = await this._findNodeInstanceNext({ nodeRefId: contextEdge._edgeRef.target });
      // enter
      return await nodeInstanceNext.enter();
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
      // atom
      if (this.context._flow.flowAtomId) {
        this.context._atom = await ctx.bean.atom.read({ key: { atomId: this.context._flow.flowAtomId } });
      }
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
      // done
      this.context._flowVars._dirty = false;
    }

    async _endFlow(options) {
      const flowRemark = (options && options.flowRemark) || null;
      const timeEnd = new Date();
      // raise event: onFlowEnd
      await this._flowListener.onFlowEnd();
      // flow
      this.context._flow.flowStatus = this.constant.flow.status.end;
      this.context._flow.timeEnd = timeEnd;
      this.context._flow.flowRemark = flowRemark;
      await this.modelFlow.update(this.context._flow);
      // flow history
      this.context._flowHistory.flowStatus = this.context._flow.flowStatus;
      this.context._flowHistory.timeEnd = timeEnd;
      this.context._flowHistory.flowRemark = flowRemark;
      await this.modelFlowHistory.update(this.context._flowHistory);
      // atom
      if (this.context._flow.flowAtomId) {
        // _submitDirect
        await ctx.bean.atom._submitDirect({
          key: { atomId: this.context._flow.flowAtomId },
          item: this.context._atom,
          user: { id: this.context._atom.userIdUpdated },
        });
      }
      // log
      console.log(`--------flow end: ${this.context._flowId}`);
    }

    async _createFlow({ flowAtomId, flowVars, flowUserId }) {
      // flow
      const data = {
        flowDefId: this.context._flowDef.atomId,
        flowDefKey: this.context._flowDefKey,
        version: this.context._flowDef.version,
        flowStatus: this.constant.flow.status.flowing,
        flowAtomId,
        flowVars: JSON.stringify(flowVars),
        flowUserId,
      };
      const res = await this.modelFlow.insert(data);
      const flowId = res.insertId;
      // flowHistory
      data.flowId = flowId;
      await this.modelFlowHistory.insert(data);
      // atom
      await this.modelAtom.update({
        id: flowAtomId,
        atomFlowId: flowId,
      });
      // ok
      return flowId;
    }

    _createNodeInstance2({ nodeRef }) {
      const node = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.node`, {
        flowInstance: this, context: this.context, nodeRef,
      });
      return node;
    }

    async _loadNodeInstance({ flowNode }) {
      const nodeRef = this._findNodeRef({ nodeRefId: flowNode.flowNodeDefId });
      if (!nodeRef) ctx.throw.module(moduleInfo.relativeName, 1005, flowNode.flowNodeDefId);
      const node = this._createNodeInstance2({ nodeRef });
      await node._load({ flowNode });
      return node;
    }

    async _createNodeInstance({ nodeRef }) {
      const node = this._createNodeInstance2({ nodeRef });
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

    _findNodeRef({ nodeRefId }) {
      const nodeRef = this.context._flowDefContent.process.nodes.find(node => {
        return nodeRefId === node.id;
      });
      return nodeRef;
    }

    async _findNodeInstanceNext({ nodeRefId }) {
      const nodeRef = this._findNodeRef({ nodeRefId });
      if (!nodeRef) return null;
      return await this._createNodeInstance({ nodeRef });
    }

    async _findNodeInstanceStartEvent({ startEventId }) {
      const nodeRef = this.context._flowDefContent.process.nodes.find(node => {
        return (startEventId && startEventId === node.id) || (!startEventId && node.type === 'startEventNone');
      });
      if (!nodeRef) return null;
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
