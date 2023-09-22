const VarsFn = require('../../common/vars.js');
const UtilsFn = require('../../common/utils.js');

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
        flowInstance: this,
        context: this.context,
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
    get modelFlowNode() {
      return ctx.model.module(moduleInfo.relativeName).flowNode;
    }
    get modelFlowNodeHistory() {
      return ctx.model.module(moduleInfo.relativeName).flowNodeHistory;
    }
    get constant() {
      return ctx.constant.module(moduleInfo.relativeName);
    }

    async start({ flowName, flowAtomId, flowAtomClassId, flowVars, flowUserId, startEventId }) {
      if (!flowVars) flowVars = {};
      if (flowUserId === undefined) flowUserId = 0;
      // create flow
      const flowId = await this._createFlow({ flowName, flowAtomId, flowAtomClassId, flowVars, flowUserId });
      // context init
      await this._contextInit({ flowId });
      // raise event: onFlowStart
      await this._flowListener.onFlowStart({ flowVars, flowUserId, startEventId });
      await this._saveFlowVars();
      // node: startEvent
      const nodeInstanceStartEvent = await this._findNodeInstanceStartEvent({ startEventId });
      if (!nodeInstanceStartEvent) {
        throw new Error(
          `startEvent not found: ${this.context._flowDef.atomStaticKey}.${startEventId || 'startEventNone'}`
        );
      }
      // node enter
      const finished = await nodeInstanceStartEvent.enter();
      if (!finished) {
        // notify
        this._notifyFlowInitiateds(flowUserId);
        // console.log(`--------flow break: ${flowId}`);
      }
    }

    async _load({ flow, history }) {
      // context init
      await this._contextInit({ flowId: flow.id, history });
    }

    // return true, means has one edge to be taken
    async nextEdges({ contextNode, behaviorDefId }) {
      const edgeInstances = await this._findEdgeInstancesNext({
        nodeDefId: contextNode._nodeDef.id,
        contextNode,
        behaviorDefId,
      });
      if (edgeInstances.length === 0) return false;
      for (const edgeInstance of edgeInstances) {
        // check if end
        if (this.context._flow.flowStatus !== this.constant.flow.status.flowing) {
          ctx.throw.module(moduleInfo.relativeName, 1008, this.context._flowId);
        }
        // enter
        const res = await edgeInstance.enter();
        if (res) {
          return true;
        }
      }
      // should throw exception
      ctx.throw.module(moduleInfo.relativeName, 1010, contextNode._flowNodeId);
      // return false;
    }

    async nextNode({ contextEdge }) {
      const nodeInstanceNext = await this._findNodeInstanceNext({
        nodeDefId: contextEdge._edgeDef.target,
        flowNodeIdPrev: contextEdge.contextNode._flowNodeId,
        contextEdge,
      });
      // enter
      return await nodeInstanceNext.enter();
    }

    async _contextInit({ flowId, history }) {
      // flowId
      this.context._flowId = flowId;
      // flow
      if (!history) {
        this.context._flow = await this.modelFlow.get({ id: flowId });
      }
      this.context._flowHistory = await this.modelFlowHistory.get({ flowId });
      // flowVars
      this.context._flowVars = new (VarsFn())();
      this.context._flowVars._vars = this.context._flowHistory.flowVars
        ? JSON.parse(this.context._flowHistory.flowVars)
        : {};
      // atom
      if (!this.context._atom && this.context._flowHistory.flowAtomId) {
        this.context._atom = await this._contextInit_atom({
          atomId: this.context._flowHistory.flowAtomId,
          atomClassId: this.context._flowHistory.flowAtomClassId,
        });
      }
      // utils
      this.context._utils = new (UtilsFn({ ctx, flowInstance: this }))({
        context: this.context,
      });
    }

    async _contextInit_atom({ atomId, atomClassId }) {
      return await ctx.bean.atom.read({
        key: { atomId },
        atomClass: { id: atomClassId },
      });
    }

    async _saveFlowVars() {
      if (!this.context._flowVars._dirty) return;
      // flow
      this.context._flow.flowVars = JSON.stringify(this.context._flowVars._vars);
      // modelFlow maybe deleted when flowStatus=1
      if (this.context._flowHistory.flowStatus === 0) {
        await this.modelFlow.update(this.context._flow);
      }
      // flow history
      this.context._flowHistory.flowVars = this.context._flow.flowVars;
      await this.modelFlowHistory.update(this.context._flowHistory);
      // done
      this.context._flowVars._dirty = false;
    }

    async _createFlow({ flowName, flowAtomId, flowAtomClassId, flowVars, flowUserId }) {
      if (flowAtomId === undefined) {
        flowAtomId = 0;
        flowAtomClassId = 0;
      }
      if (flowAtomId && !flowAtomClassId) {
        const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: flowAtomId });
        flowAtomClassId = atomClass.id;
      }
      // flowName
      if (!flowName && flowAtomId) {
        this.context._atom = await this._contextInit_atom({ atomId: flowAtomId, atomClassId: flowAtomClassId });
        flowName = this.context._atom.atomName;
      }
      if (!flowName) {
        flowName = this.context._flowDef.atomName;
      }
      // flow
      const data = {
        flowDefId: this.context._flowDef.atomId,
        flowDefKey: this.context._flowDef.atomStaticKey,
        flowDefRevision: this.context._flowDef.atomRevision,
        flowStatus: this.constant.flow.status.flowing,
        flowName,
        flowAtomId,
        flowAtomClassId,
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

    _createNodeInstance2({ nodeDef, contextEdge }) {
      const node = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.node`, {
        flowInstance: this,
        context: this.context,
        contextEdge,
        nodeDef,
      });
      return node;
    }

    async _loadNodeInstance({ flowNode, history }) {
      const nodeDef = this._findNodeDef({ nodeDefId: flowNode.flowNodeDefId });
      if (!nodeDef) ctx.throw.module(moduleInfo.relativeName, 1005, flowNode.flowNodeDefId);
      const node = this._createNodeInstance2({ nodeDef });
      await node._load({ flowNode, history });
      return node;
    }

    // contextEdge maybe null
    async _createNodeInstance({ nodeDef, flowNodeIdPrev, contextEdge }) {
      const node = this._createNodeInstance2({ nodeDef, contextEdge });
      await node.init({ flowNodeIdPrev });
      return node;
    }

    async _createEdgeInstance({ edgeDef, contextNode }) {
      const edge = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.edge`, {
        flowInstance: this,
        context: this.context,
        contextNode,
        edgeDef,
      });
      await edge.init();
      return edge;
    }

    _findNodeDef({ nodeDefId }) {
      const nodeDef = this.context._flowDefContent.process.nodes.find(node => {
        return nodeDefId === node.id;
      });
      return nodeDef;
    }

    // contextEdge maybe null
    async _findNodeInstanceNext({ nodeDefId, flowNodeIdPrev, contextEdge }) {
      const nodeDef = this._findNodeDef({ nodeDefId });
      if (!nodeDef) return null;
      return await this._createNodeInstance({ nodeDef, flowNodeIdPrev, contextEdge });
    }

    async _findNodeInstanceStartEvent({ startEventId }) {
      const nodeDef = this.context._flowDefContent.process.nodes.find(node => {
        return (startEventId && startEventId === node.id) || (!startEventId && node.type === 'startEventNone');
      });
      if (!nodeDef) return null;
      return await this._createNodeInstance({ nodeDef });
    }

    async _findEdgeInstancesNext({ nodeDefId, contextNode, behaviorDefId }) {
      const edges = [];
      for (const edgeDef of this.context._flowDefContent.process.edges) {
        if (edgeDef.source === nodeDefId && (edgeDef.behavior || '') === (behaviorDefId || '')) {
          const edge = await this._createEdgeInstance({ edgeDef, contextNode });
          edges.push(edge);
        }
      }
      return edges;
    }

    // find from history
    async _findFlowNodeHistoryPrevious({ flowNodeId, cb }) {
      let flowNode = await this.modelFlowNodeHistory.get({ flowNodeId });
      while (flowNode && flowNode.flowNodeIdPrev !== 0) {
        flowNode = await this.modelFlowNodeHistory.get({ flowNodeId: flowNode.flowNodeIdPrev });
        if (!flowNode) return null;
        if (!cb) return flowNode;
        // nodeDef
        const nodeDef = this._findNodeDef({ nodeDefId: flowNode.flowNodeDefId });
        if (cb({ flowNode, nodeDef })) return flowNode;
      }
      return null;
    }

    _getOpUser() {
      let user = ctx.state.user && ctx.state.user.op;
      if (!user || user.anonymous === 1) {
        user = { id: 0 };
        // user = { id: this.context._flow.flowUserId };
      }
      return user;
    }

    _notifyFlowInitiateds(flowUserId) {
      if (flowUserId) {
        ctx.bean.stats.notify({
          module: moduleInfo.relativeName,
          name: 'flowInitiateds',
          user: { id: flowUserId },
        });
      }
    }
  }

  return FlowInstance;
};
