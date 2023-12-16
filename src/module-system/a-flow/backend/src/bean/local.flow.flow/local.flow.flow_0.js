const VarsFn = require('../../common/vars.js');
const UtilsFn = require('../../common/utils.js');

const moduleInfo = module.info;

module.exports = class FlowInstance {
  __init__({ flowDef }) {
    // context
    this.context = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.context.flow`, {
      flowDef,
    });
    // listener
    this._flowListener = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.listener`, {
      flowInstance: this,
      context: this.context,
    });
  }

  get modelAtom() {
    return this.ctx.model.module('a-base').atom;
  }
  get modelFlow() {
    return this.ctx.model.module(moduleInfo.relativeName).flow;
  }
  get modelFlowHistory() {
    return this.ctx.model.module(moduleInfo.relativeName).flowHistory;
  }
  get modelFlowNode() {
    return this.ctx.model.module(moduleInfo.relativeName).flowNode;
  }
  get modelFlowNodeHistory() {
    return this.ctx.model.module(moduleInfo.relativeName).flowNodeHistory;
  }
  get constant() {
    return this.ctx.constant.module(moduleInfo.relativeName);
  }

  async start({ flowName, flowAtomId, flowAtomClassId, flowVars, flowUserId, startEventId }) {
    if (!flowVars) flowVars = {};
    if (flowUserId === undefined) flowUserId = 0;
    // create flow
    const flowId = await this._createFlow({ flowName, flowAtomId, flowAtomClassId, flowVars, flowUserId });
    // context init
    await this._contextInit({ flowId });
    // node: startEvent
    const nodeInstanceStartEvent = await this._findNodeInstanceStartEvent({ startEventId });
    if (!nodeInstanceStartEvent) {
      const atomStaticKey = this.context._flowDef.atomStaticKey;
      const message = `startEvent not found: ${atomStaticKey}.${startEventId || 'startEventNone'}`;
      throw new Error(message);
    }
    // real startEventId
    startEventId = nodeInstanceStartEvent.contextNode._nodeDef.id;
    // raise event: onFlowStart
    const debug = this.ctx.app.bean.debug.get('flow');
    debug('flow start: flowId:%d, startEventId:%s', flowId, startEventId);
    await this._flowListener.onFlowStart({ flowVars, flowUserId, startEventId });
    await this._saveFlowVars();
    // node enter
    const finished = await nodeInstanceStartEvent.enter();
    debug('flow %s: flowId:%d', finished ? 'finished' : 'break', flowId);
    // tail
    if (flowAtomId) {
      this.ctx.tail(async () => {
        const flow = await this.modelFlow.get({ id: flowId });
        if (flow) {
          // means: not end
          // notify
          this._notifyFlowInitiateds(flowUserId);
        }
      });
    }
  }

  async _load({ flow, history }) {
    // context init
    await this._contextInit({ flowId: flow.id, history });
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
    this.context._utils = new (UtilsFn({ ctx: this.ctx, flowInstance: this }))({
      context: this.context,
    });
  }

  async _contextInit_atom({ atomId, atomClassId }) {
    return await this.ctx.bean.atom.read({
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
      const atomClass = await this.ctx.bean.atomClass.getByAtomId({ atomId: flowAtomId });
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
    const node = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.node`, {
      flowInstance: this,
      context: this.context,
      contextEdge,
      nodeDef,
    });
    return node;
  }

  async _loadNodeInstance({ flowNode, history }) {
    const nodeDef = this._findNodeDef({ nodeDefId: flowNode.flowNodeDefId });
    if (!nodeDef) this.ctx.throw.module(moduleInfo.relativeName, 1005, flowNode.flowNodeDefId);
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
    const edge = this.ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.edge`, {
      flowInstance: this,
      context: this.context,
      contextNode,
      edgeDef,
    });
    await edge.init();
    return edge;
  }

  _findNodeDef({ nodeDefId }) {
    return this.ctx.bean.flowDef._findNode({ content: this.context._flowDefContent, nodeDefId });
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
    let user = this.ctx.state.user && this.ctx.state.user.op;
    if (!user || user.anonymous === 1) {
      user = { id: 0 };
      // user = { id: this.context._flow.flowUserId };
    }
    return user;
  }

  _notifyFlowInitiateds(flowUserId) {
    if (flowUserId) {
      this.ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'flowInitiateds',
        user: { id: flowUserId },
      });
    }
  }
};
