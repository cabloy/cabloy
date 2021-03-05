module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 885:
/***/ ((module) => {

module.exports = app => {

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // add flowDef
      const res = await this.ctx.model.flowDef.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      // add content
      await this.ctx.model.flowDefContent.insert({
        atomId: key.atomId,
        itemId,
        content: '{}',
      });
      return { atomId: key.atomId, itemId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update flowDef
      const data = await this.ctx.model.flowDef.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.flowDef.update(data);
      // update content
      await this.ctx.model.flowDefContent.update({
        content: item.content,
      }, { where: {
        atomId: key.atomId,
      } });

      // deploy
      if (item.atomStage === 1) {
        const _atom = await this.ctx.bean.atom.modelAtom.get({ id: key.atomId });
        if (_atom.atomDisabled === 0) {
          this.ctx.tail(async () => {
            await this.ctx.bean.flowDef.deploy({ flowDefId: key.atomId });
          });
        }
      }
    }

    async delete({ atomClass, key, user }) {
      // delete flowDef
      await this.ctx.model.flowDef.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.flowDefContent.delete({
        itemId: key.itemId,
      });
      // super
      await super.delete({ atomClass, key, user });
    }

    async enable({ atomClass, key, user }) {
      // super
      await super.enable({ atomClass, key, user });
      // deploy
      this.ctx.tail(async () => {
        await this.ctx.bean.flowDef.deploy({ flowDefId: key.atomId });
      });
    }

    _getMeta(item) {
      // flags
      const flags = [];
      // meta
      const meta = {
        summary: item.description,
        flags,
      };
      // ok
      item._meta = meta;
    }

  }

  return Atom;
};


/***/ }),

/***/ 869:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const vm = __webpack_require__(184);

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Flow {

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

    get sqlProcedure() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.procedure');
    }

    async startByKey({ flowDefKey, flowAtomId, flowVars, flowUserId, startEventId }) {
      // fullKey
      const { fullKey } = ctx.bean.flowDef._combineFullKey({ flowDefKey });
      // get flow def
      const flowDef = await ctx.bean.flowDef.getByKey({ flowDefKey });
      if (!flowDef) ctx.throw.module(moduleInfo.relativeName, 1001, fullKey);
      if (flowDef.atomDisabled === 1) ctx.throw.module(moduleInfo.relativeName, 1002, fullKey);
      return await this._start({ flowDef, flowAtomId, flowVars, flowUserId, startEventId });
    }

    async startById({ flowDefId, flowAtomId, flowVars, flowUserId, startEventId }) {
      // get flow def
      const flowDef = await ctx.bean.flowDef.getById({ flowDefId });
      if (!flowDef) ctx.throw.module(moduleInfo.relativeName, 1001, flowDefId);
      if (flowDef.atomDisabled === 1) ctx.throw.module(moduleInfo.relativeName, 1002, flowDef.atomStaticKey);
      return await this._start({ flowDef, flowAtomId, flowVars, flowUserId, startEventId });
    }

    evaluateExpression({ expression, globals }) {
      return vm.runInContext(expression, vm.createContext(globals || {}));
    }

    async executeService({ bean, parameterExpression, parameter, globals }) {
      if (parameterExpression !== undefined) {
        parameter = this.evaluateExpression({ expression: parameterExpression, globals });
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
      const context = Object.assign({ }, globals);
      if (parameter !== undefined) {
        context.parameter = parameter;
      }
      return await beanInstance.execute(context);
    }

    async _start({ flowDef, flowAtomId, flowVars, flowUserId, startEventId }) {
      // flowInstance
      const flowInstance = this._createFlowInstance({ flowDef });
      // start
      await flowInstance.start({ flowAtomId, flowVars, flowUserId, startEventId });
      // ok
      return flowInstance;
    }

    async _loadFlowInstance({ flowId, history }) {
      // flow
      let flow;
      if (!history) {
        flow = await this.modelFlow.get({ id: flowId });
      } else {
        flow = await this.modelFlowHistory.get({ flowId });
      }
      if (!flow) ctx.throw.module(moduleInfo.relativeName, 1003, flowId);
      // flowDef: by key+revision
      const flowDef = await ctx.bean.flowDef.getByKeyAndRevision({ flowDefKey: flow.flowDefKey, flowDefRevision: flow.flowDefRevision });
      if (!flowDef) ctx.throw.module(moduleInfo.relativeName, 1001, flow.flowDefId);
      // not check atomDisabled
      // flowInstance
      const flowInstance = this._createFlowInstance({ flowDef });
      // load
      await flowInstance._load({ flow, history });
      // ok
      return flowInstance;
    }

    _createFlowInstance({ flowDef }) {
      const flowInstance = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.flow`, {
        flowDef,
      });
      return flowInstance;
    }

    async _loadFlowNodeInstance({ flowNodeId, history }) {
      // get
      let flowNode;
      if (!history) {
        flowNode = await this.modelFlowNode.get({ id: flowNodeId });
      } else {
        flowNode = await this.modelFlowNodeHistory.get({ flowNodeId });
      }
      if (!flowNode) ctx.throw.module(moduleInfo.relativeName, 1004, flowNodeId);
      // load flow
      const flowInstance = await this._loadFlowInstance({ flowId: flowNode.flowId, history });
      // load flow node
      const flowNodeInstance = await flowInstance._loadNodeInstance({ flowNode, history });
      return flowNodeInstance;
    }

    async count({ options, user }) {
      return await this.select({ options, user, count: 1 });
    }

    async select({ options, user, pageForce = true, count = 0 }) {
      const items = await this._list({ options, user, pageForce, count });
      for (const item of items) {
        if (item.flowNodeNameCurrent) {
          item.flowNodeNameCurrentLocale = ctx.text(item.flowNodeNameCurrent);
        }
        if (item.flowRemark) {
          item.flowRemarkLocale = ctx.text(item.flowRemark);
        }
      }
      return items;
    }

    async get({ flowId, history, user }) {
      const flows = await this.select({
        options: {
          where: {
            'a.id': flowId,
          },
          mode: history ? 'history' : 'flowing',
        },
        user,
      });
      return flows[0];
    }

    // mode: mine/others/flowing/history
    async _list({ options: { where, orders, page, mode }, user, pageForce = true, count = 0 }) {
      page = ctx.bean.util.page(page, pageForce);
      const sql = this.sqlProcedure.selectFlows({
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
        where, orders, page,
        count,
        mode,
      });
      const res = await ctx.model.query(sql);
      return count ? res[0]._count : res;
    }

  }

  return Flow;
};


/***/ }),

/***/ 495:
/***/ ((module) => {


const __flowNodeBases = {};
const __flowEdgeBases = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowDef {

    get modelFlowDef() {
      return ctx.model.module(moduleInfo.relativeName).flowDef;
    }
    get modelFlowDefContent() {
      return ctx.model.module(moduleInfo.relativeName).flowDefContent;
    }
    get modelFlowDefFull() {
      return ctx.model.module(moduleInfo.relativeName).flowDefFull;
    }
    get atomClass() {
      return {
        module: moduleInfo.relativeName,
        atomClassName: 'flowDef',
      };
    }

    async getByKey({ flowDefKey }) {
      return await this._getByKey({ flowDefKey, atomStage: 'formal' });
    }

    async getById({ flowDefId }) {
      // get
      return await this._getById({ flowDefId });
    }

    async getByKeyAndRevision({ flowDefKey, flowDefRevision }) {
      // get from formal
      let flowDef = await this._getByKey({ flowDefKey, flowDefRevision, atomStage: 'formal' });
      if (flowDef) return flowDef;
      // get from history
      flowDef = await this._getByKey({ flowDefKey, flowDefRevision, atomStage: 'history' });
      if (flowDef) return flowDef;
      // not found
      return null;
    }

    async deploy({ flowDefId }) {
      // queue
      await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'deploy',
        queueNameSub: flowDefId,
        data: { flowDefId },
      });
    }

    async _deployQueue({ flowDefId }) {
      // flowDef
      const flowDef = await this._getById({ flowDefId });
      if (!flowDef) return;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content) return;
      // all startEvents
      for (const node of content.process.nodes) {
        const nodeType = node.type;
        if (nodeType.indexOf('startEvent') !== 0) continue;
        const _nodeBase = this._getFlowNodeBase(nodeType);
        const _nodeBaseBean = ctx.bean._newBean(_nodeBase.beanFullName);
        if (_nodeBaseBean.deploy) {
          await _nodeBaseBean.deploy({
            deploy: flowDef.atomDisabled === 0,
            flowDefId,
            node,
          });
        }
      }
    }

    async _getById({ flowDefId }) {
      return await ctx.bean.atom.read({ key: { atomId: flowDefId } });
    }

    async _getByKey({ flowDefKey, flowDefRevision, atomStage }) {
      // fullKey
      const { fullKey } = this._combineFullKey({ flowDefKey });
      // from db
      return await ctx.bean.atom.readByStaticKey({
        atomClass: this.atomClass,
        atomStaticKey: fullKey,
        atomRevision: flowDefRevision,
        atomStage,
      });
    }

    _getFlowNodeBases() {
      if (!__flowNodeBases[ctx.locale]) {
        __flowNodeBases[ctx.locale] = this._prepareFlowNodeBases();
      }
      return __flowNodeBases[ctx.locale];
    }

    _getFlowNodeBase(nodeType) {
      return this._getFlowNodeBases()[nodeType];
    }

    _prepareFlowNodeBases() {
      const flowNodeBases = {};
      for (const module of ctx.app.meta.modulesArray) {
        const nodes = module.main.meta && module.main.meta.flow && module.main.meta.flow.nodes;
        if (!nodes) continue;
        for (const key in nodes) {
          const node = nodes[key];
          const beanName = node.bean;
          let beanFullName;
          if (typeof beanName === 'string') {
            beanFullName = `${module.info.relativeName}.flow.node.${beanName}`;
          } else {
            beanFullName = `${beanName.module || module.info.relativeName}.flow.node.${beanName.name}`;
          }
          // const fullKey = `${module.info.relativeName}:${key}`;
          const fullKey = key;
          flowNodeBases[fullKey] = {
            ...node,
            beanFullName,
            title: ctx.text(node.title),
          };
        }
      }
      return flowNodeBases;
    }

    _getFlowEdgeBases() {
      if (!__flowEdgeBases[ctx.locale]) {
        __flowEdgeBases[ctx.locale] = this._prepareFlowEdgeBases();
      }
      return __flowEdgeBases[ctx.locale];
    }

    _getFlowEdgeBase(edgeType = 'sequence') {
      return this._getFlowEdgeBases()[edgeType];
    }

    _prepareFlowEdgeBases() {
      const flowEdgeBases = {};
      for (const module of ctx.app.meta.modulesArray) {
        const edges = module.main.meta && module.main.meta.flow && module.main.meta.flow.edges;
        if (!edges) continue;
        for (const key in edges) {
          const edge = edges[key];
          const beanName = edge.bean;
          let beanFullName;
          if (typeof beanName === 'string') {
            beanFullName = `${module.info.relativeName}.flow.edge.${beanName}`;
          } else {
            beanFullName = `${beanName.module || module.info.relativeName}.flow.edge.${beanName.name}`;
          }
          // const fullKey = `${module.info.relativeName}:${key}`;
          const fullKey = key;
          flowEdgeBases[fullKey] = {
            ...edge,
            beanFullName,
            title: ctx.text(edge.title),
          };
        }
      }
      return flowEdgeBases;
    }

    _combineFullKey({ flowDefKey }) {
      let fullKey;
      let dynamic;
      if (typeof flowDefKey === 'string') {
        dynamic = 1;
        fullKey = flowDefKey;
      } else {
        dynamic = 0;
        fullKey = `${flowDefKey.module}:${flowDefKey.name}`;
      }
      return { fullKey, dynamic };
    }
  }

  return FlowDef;
};


/***/ }),

/***/ 88:
/***/ ((module) => {

module.exports = ctx => {

  class ContextEdge {

    constructor({ context, contextNode, edgeDef }) {
      this.context = context;
      this.contextNode = contextNode;
      this._edgeDef = edgeDef;
      //
      this._utils = null;
    }

    get utils() {
      return this._utils;
    }

  }

  return ContextEdge;
};


/***/ }),

/***/ 302:
/***/ ((module) => {

module.exports = ctx => {

  class ContextFlow {

    constructor({ flowDef }) {
      this._flowDef = flowDef;
      this._flowDefContent = JSON.parse(this._flowDef.content);
      //
      this._flowId = null;
      this._flow = null;
      this._flowHistory = null;
      this._flowVars = null;
      //
      this._atom = null;
      //
      this._utils = null;
    }

    get vars() {
      return this._flowVars;
    }

    get atom() {
      return this._atom;
    }

    get utils() {
      return this._utils;
    }

  }

  return ContextFlow;
};


/***/ }),

/***/ 901:
/***/ ((module) => {

module.exports = ctx => {

  class ContextNode {

    constructor({ context, nodeDef }) {
      this.context = context;
      this._nodeDef = nodeDef;
      //
      this._flowNodeId = null;
      this._flowNode = null;
      this._flowNodeHistory = null;
      this._nodeVars = null;
      //
      this._utils = null;
    }

    get vars() {
      return this._nodeVars;
    }

    get utils() {
      return this._utils;
    }

  }

  return ContextNode;
};


/***/ }),

/***/ 1:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const UtilsFn = __webpack_require__(294);

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowEdge {
    constructor({ flowInstance, context, contextNode, edgeDef }) {
      this.flowInstance = flowInstance;
      this.context = context;
      this.contextNode = contextNode;
      this._edgeBase = null;
      this._edgeBaseBean = null;
      // context
      this.contextEdge = ctx.bean._newBean(`${moduleInfo.relativeName}.local.context.edge`, {
        context, contextNode, edgeDef,
      });
    }

    async init() {
      // context init
      await this._contextInit();
    }

    async _contextInit() {
      // utils
      this.contextEdge._utils = new (UtilsFn({ ctx, flowInstance: this.flowInstance }))({
        context: this.context,
        contextNode: this.contextNode,
        contextEdge: this.contextEdge,
      });
    }

    async _saveVars() {
      // save flowVars
      await this.flowInstance._saveFlowVars();
    }

    async enter() {
      // raise event: onEdgeEnter
      const res = await this.edgeBaseBean.onEdgeEnter();
      await this._saveVars();
      if (!res) return false;
      return await this.take();
    }

    async take() {
      // raise event: onEdgeTake
      const res = await this.edgeBaseBean.onEdgeTake();
      await this._saveVars();
      if (!res) return false;
      return await this.leave();
    }

    async leave() {
      // raise event: onEdgeLeave
      const res = await this.edgeBaseBean.onEdgeLeave();
      await this._saveVars();
      if (!res) return false;
      // next
      return await this.flowInstance.nextNode({ contextEdge: this.contextEdge });
    }

    get edgeBaseBean() {
      if (!this._edgeBaseBean) {
        this._edgeBaseBean = ctx.bean._newBean(this.edgeBase.beanFullName, {
          flowInstance: this.flowInstance, edgeInstance: this,
          context: this.context, contextNode: this.contextNode, contextEdge: this.contextEdge,
        });
      }
      return this._edgeBaseBean;
    }

    get edgeBase() {
      if (!this._edgeBase) this._edgeBase = ctx.bean.flowDef._getFlowEdgeBase(this.contextEdge._edgeDef.type);
      return this._edgeBase;
    }

  }
  return FlowEdge;
};


/***/ }),

/***/ 59:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const VarsFn = __webpack_require__(418);
const UtilsFn = __webpack_require__(294);

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
    get modelFlowNode() {
      return ctx.model.module(moduleInfo.relativeName).flowNode;
    }
    get modelFlowNodeHistory() {
      return ctx.model.module(moduleInfo.relativeName).flowNodeHistory;
    }
    get constant() {
      return ctx.constant.module(moduleInfo.relativeName);
    }

    async start({ flowName, flowAtomId, flowVars, flowUserId, startEventId }) {
      if (!flowVars) flowVars = {};
      if (flowUserId === undefined) flowUserId = 0;
      // create flow
      const flowId = await this._createFlow({ flowName, flowAtomId, flowVars, flowUserId });
      // context init
      await this._contextInit({ flowId });
      // raise event: onFlowStart
      await this._flowListener.onFlowStart({ flowVars, flowUserId, startEventId });
      await this._saveFlowVars();
      // node: startEvent
      const nodeInstanceStartEvent = await this._findNodeInstanceStartEvent({ startEventId });
      if (!nodeInstanceStartEvent) throw new Error(`startEvent not found: ${this.context._flowDef.atomStaticKey}.${startEventId || 'startEventNone'}`);
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

    async nextEdges({ contextNode }) {
      const edgeInstances = await this._findEdgeInstancesNext({ nodeDefId: contextNode._nodeDef.id, contextNode });
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
      const nodeInstanceNext = await this._findNodeInstanceNext({
        nodeDefId: contextEdge._edgeDef.target,
        flowNodeIdPrev: contextEdge.contextNode._flowNodeId,
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
      this.context._flowVars._vars = this.context._flowHistory.flowVars ? JSON.parse(this.context._flowHistory.flowVars) : {};
      // atom
      if (!this.context._atom && this.context._flowHistory.flowAtomId) {
        this.context._atom = await this._contextInit_atom({ atomId: this.context._flowHistory.flowAtomId });
      }
      // utils
      this.context._utils = new (UtilsFn({ ctx, flowInstance: this }))({
        context: this.context,
      });
    }

    async _contextInit_atom({ atomId }) {
      return await ctx.bean.atom.read({ key: { atomId } });
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
      const flowId = this.context._flowId;
      const flowStatus = this.constant.flow.status.end;
      const flowRemark = (options && options.flowRemark) || null;
      const timeEnd = new Date();
      // check if end
      if (this.context._flow.flowStatus === flowStatus) {
        ctx.throw.module(moduleInfo.relativeName, 1008, flowId);
      }
      ctx.tail(async () => {
        // need not in transaction
        // flow: update fields for onFlowEnd
        this.context._flow.flowStatus = flowStatus;
        this.context._flow.flowRemark = flowRemark;
        this.context._flow.timeEnd = timeEnd;
        await this.modelFlow.delete({ id: flowId });
        // flow history
        this.context._flowHistory.flowStatus = flowStatus;
        this.context._flowHistory.flowRemark = flowRemark;
        this.context._flowHistory.timeEnd = timeEnd;
        await this.modelFlowHistory.update(this.context._flowHistory);
        // raise event: onFlowEnd
        await this._flowListener.onFlowEnd(options);
        // clear nodes
        await this._clearNodeRemains();
        // publish uniform message
        await this._endFlowPublish();
        // log
        // console.log(`--------flow end: ${flowId}`);
      });
      // notify
      this._notifyFlowInitiateds(this.context._flow.flowUserId);
    }

    async _endFlowPublish() {
      // publish uniform message
      const userOp = this._getOpUser();
      const flowUserId = this.context._flow.flowUserId;
      if (flowUserId !== userOp.id) {
        const userFlow = await ctx.bean.user.get({ id: flowUserId });
        const title = `${ctx.text.locale(userFlow.locale, 'FlowTitle')} - ${ctx.text.locale(userFlow.locale, this.context._flow.flowRemark || 'End')}`;
        const actionPath = `/a/flowtask/flow?flowId=${this.context._flowId}`;
        const message = {
          userIdTo: flowUserId,
          content: {
            issuerId: userFlow.id,
            issuerName: userFlow.userName,
            issuerAvatar: userFlow.avatar,
            title,
            body: this.context._flow.flowName,
            actionPath,
            params: {
              flowId: this.context._flowId,
            },
          },
        };
        // jump out of the transaction
        ctx.tail(async () => {
          await ctx.bean.io.publish({
            message,
            messageClass: {
              module: 'a-flow',
              messageClassName: 'workflow',
            },
          });
        });
      }
    }

    async _clearNodeRemains() {
      const flowId = this.context._flowId;
      const flowNodes = await this.modelFlowNode.select({
        where: { flowId },
      });
      for (const flowNode of flowNodes) {
        const flowNodeInstance = await this._loadNodeInstance({ flowNode });
        await flowNodeInstance._clearRemains();
      }
    }

    async _createFlow({ flowName, flowAtomId, flowVars, flowUserId }) {
      // flowName
      if (!flowName && flowAtomId) {
        this.context._atom = await this._contextInit_atom({ atomId: flowAtomId });
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

    _createNodeInstance2({ nodeDef }) {
      const node = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.node`, {
        flowInstance: this, context: this.context, nodeDef,
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

    async _createNodeInstance({ nodeDef, flowNodeIdPrev }) {
      const node = this._createNodeInstance2({ nodeDef });
      await node.init({ flowNodeIdPrev });
      return node;
    }

    async _createEdgeInstance({ edgeDef, contextNode }) {
      const edge = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.edge`, {
        flowInstance: this, context: this.context, contextNode, edgeDef,
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

    async _findNodeInstanceNext({ nodeDefId, flowNodeIdPrev }) {
      const nodeDef = this._findNodeDef({ nodeDefId });
      if (!nodeDef) return null;
      return await this._createNodeInstance({ nodeDef, flowNodeIdPrev });
    }

    async _findNodeInstanceStartEvent({ startEventId }) {
      const nodeDef = this.context._flowDefContent.process.nodes.find(node => {
        return (startEventId && startEventId === node.id) || (!startEventId && node.type === 'startEventNone');
      });
      if (!nodeDef) return null;
      return await this._createNodeInstance({ nodeDef });
    }

    async _findEdgeInstancesNext({ nodeDefId, contextNode }) {
      const edges = [];
      for (const edgeDef of this.context._flowDefContent.process.edges) {
        if (edgeDef.source === nodeDefId) {
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

    async _parseAssignees({ users, roles, vars }) {
      // init
      let assignees = [];

      // 1. users
      const _users = this._ensureIntArray(users);
      if (_users) {
        assignees = assignees.concat(_users);
      }

      // 2. roles
      const _roles = this._ensureArray(roles);
      if (_roles) {
        for (let roleId of _roles) {
          if (isNaN(roleId)) {
            const role = await ctx.bean.role.get({ roleName: roleId });
            if (!role) ctx.throw.module(moduleInfo.relativeName, 1007, roleId);
            roleId = role.id;
          }
          const list = await ctx.bean.role.usersOfRoleParent({ roleId, disabled: 0, removePrivacy: true });
          assignees = assignees.concat(list.map(item => item.id));
        }
      }

      // 3. vars
      const _vars = this._ensureArray(vars);
      if (_vars) {
        for (const _var of _vars) {
          const userId = await this._parseUserVar({ _var });
          if (userId) {
            assignees.push(userId);
          }
        }
      }

      // unique
      assignees = Set.unique(assignees);

      // ok
      return assignees;
    }

    async _parseUserVar({ _var }) {
      if (_var === 'flowUser') {
        return this.context._flow.flowUserId;
      }
    }

    _getOpUser() {
      let user = ctx.state.user && ctx.state.user.op;
      if (!user || user.anonymous === 1) {
        user = { id: 0 };
        // user = { id: this.context._flow.flowUserId };
      }
      return user;
    }

    _ensureIntArray(str) {
      if (!str) return null;
      if (!Array.isArray(str)) {
        str = str.toString().split(',');
      }
      return str.map(item => parseInt(item));
    }

    _ensureArray(str) {
      if (!str) return null;
      if (!Array.isArray(str)) {
        str = str.toString().split(',');
      }
      return str;
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


/***/ }),

/***/ 408:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const vm = __webpack_require__(184);
const require3 = __webpack_require__(718);
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

    getNodeDefOptions(contextNode, { options }) {
      if (this.flowListener && this.flowListener.getNodeDefOptions) {
        return this.flowListener.getNodeDefOptions(contextNode, { options });
      }
    }

    async getSchemaRead(contextTask, contextNode, { schemaBase, schema }) {
      if (this.flowListener && this.flowListener.getSchemaRead) {
        return await this.flowListener.getSchemaRead(contextTask, contextNode, { schemaBase, schema });
      }
    }

    async getSchemaWrite(contextTask, contextNode, { schemaBase, schema }) {
      if (this.flowListener && this.flowListener.getSchemaWrite) {
        return await this.flowListener.getSchemaWrite(contextTask, contextNode, { schemaBase, schema });
      }
    }

  }

  return FlowListener;
};


/***/ }),

/***/ 154:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const VarsFn = __webpack_require__(418);
const UtilsFn = __webpack_require__(294);

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNode {
    constructor({ flowInstance, context, nodeDef }) {
      this.flowInstance = flowInstance;
      this.context = context;
      this._nodeBase = null;
      this._nodeBaseBean = null;
      // context
      this.contextNode = ctx.bean._newBean(`${moduleInfo.relativeName}.local.context.node`, {
        context, nodeDef,
      });
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

    async init({ flowNodeIdPrev }) {
      // create flowNode
      const flowNodeId = await this._createFlowNode({ flowNodeIdPrev });
      // context init
      await this._contextInit({ flowNodeId });
    }

    async _load({ flowNode, history }) {
      // context init
      await this._contextInit({ flowNodeId: flowNode.id, history });
    }

    async _createFlowNode({ flowNodeIdPrev = 0 }) {
      // flowNode
      const data = {
        flowId: this.context._flowId,
        flowNodeDefId: this.contextNode._nodeDef.id,
        flowNodeName: this.contextNode._nodeDef.name,
        flowNodeType: this.contextNode._nodeDef.type,
        flowNodeIdPrev,
        nodeVars: '{}',
      };
      const res = await this.modelFlowNode.insert(data);
      const flowNodeId = res.insertId;
      // flowNodeHistory
      data.flowNodeId = flowNodeId;
      await this.modelFlowNodeHistory.insert(data);
      // ok
      return flowNodeId;
    }

    async _contextInit({ flowNodeId, history }) {
      // flowNodeId
      this.contextNode._flowNodeId = flowNodeId;
      // flowNode
      if (!history) {
        this.contextNode._flowNode = await this.modelFlowNode.get({ id: flowNodeId });
      }
      this.contextNode._flowNodeHistory = await this.modelFlowNodeHistory.get({ flowNodeId });
      // nodeVars
      this.contextNode._nodeVars = new (VarsFn())();
      this.contextNode._nodeVars._vars = this.contextNode._flowNodeHistory.nodeVars ? JSON.parse(this.contextNode._flowNodeHistory.nodeVars) : {};
      // utils
      this.contextNode._utils = new (UtilsFn({ ctx, flowInstance: this.flowInstance }))({
        context: this.context,
        contextNode: this.contextNode,
      });
    }

    async _saveNodeVars() {
      if (!this.contextNode._nodeVars._dirty) return;
      // flowNode
      this.contextNode._flowNode.nodeVars = JSON.stringify(this.contextNode._nodeVars._vars);
      await this.modelFlowNode.update(this.contextNode._flowNode);
      // flowNode history
      this.contextNode._flowNodeHistory.nodeVars = this.contextNode._flowNode.nodeVars;
      await this.modelFlowNodeHistory.update(this.contextNode._flowNodeHistory);
      // done
      this.contextNode._nodeVars._dirty = false;
    }

    async _saveVars() {
      // save nodeVars
      await this._saveNodeVars();
      // save flowVars
      await this.flowInstance._saveFlowVars();
    }

    async _setCurrent(clear) {
      // flow
      this.context._flow.flowNodeIdCurrent = clear ? 0 : this.contextNode._flowNodeId;
      this.context._flow.flowNodeNameCurrent = clear ? '' : this.contextNode._nodeDef.name;
      await this.modelFlow.update(this.context._flow);
      // flow history
      this.context._flowHistory.flowNodeIdCurrent = this.context._flow.flowNodeIdCurrent;
      this.context._flowHistory.flowNodeNameCurrent = this.context._flow.flowNodeNameCurrent;
      await this.modelFlowHistory.update(this.context._flowHistory);
    }

    async _clear(options) {
      const flowNodeRemark = (options && options.flowNodeRemark) || null;
      const timeDone = new Date();
      // clear
      await this._setCurrent(true);
      // delete node
      await this.modelFlowNode.delete({ id: this.contextNode._flowNodeId });
      // set nodeHistoryStatus
      this.contextNode._flowNodeHistory.flowNodeStatus = 1;
      this.contextNode._flowNodeHistory.flowNodeRemark = flowNodeRemark;
      this.contextNode._flowNodeHistory.timeDone = timeDone;
      await this.modelFlowNodeHistory.update(this.contextNode._flowNodeHistory);
    }

    async _clearRemains() {
      // clear taskRemains
      if (this.nodeBaseBean.clearRemains) {
        await this.nodeBaseBean.clearRemains();
      }
      // delete node
      await this.modelFlowNode.delete({ id: this.contextNode._flowNodeId });
      // set nodeHistoryStatus
      this.contextNode._flowNodeHistory.flowNodeStatus = 1;
      await this.modelFlowNodeHistory.update(this.contextNode._flowNodeHistory);
    }

    getNodeDefOptions() {
      return this.nodeBaseBean.getNodeDefOptions();
    }

    async enter() {
      // current
      await this._setCurrent();
      // raise event: onNodeEnter
      const res = await this.nodeBaseBean.onNodeEnter();
      await this._saveVars();
      if (!res) return false;
      return await this.begin();
    }

    async begin() {
      // raise event: onNodeBegin
      const res = await this.nodeBaseBean.onNodeBegin();
      await this._saveVars();
      if (!res) return false;
      return await this.doing();
    }

    async doing() {
      // raise event: onNodeDoing
      const res = await this.nodeBaseBean.onNodeDoing();
      await this._saveVars();
      if (!res) return false;
      return await this.end();
    }

    async end() {
      // raise event: onNodeEnd
      const res = await this.nodeBaseBean.onNodeEnd();
      await this._saveVars();
      if (!res) return false;
      return await this.leave();
    }

    async leave() {
      // raise event: onNodeLeave
      const res = await this.nodeBaseBean.onNodeLeave();
      await this._saveVars();
      // clear
      await this._clear();
      // res
      if (!res) return false;
      // next
      return await this.flowInstance.nextEdges({ contextNode: this.contextNode });
    }

    get nodeBaseBean() {
      if (!this._nodeBaseBean) {
        this._nodeBaseBean = ctx.bean._newBean(this.nodeBase.beanFullName, {
          flowInstance: this.flowInstance, nodeInstance: this,
          context: this.context, contextNode: this.contextNode,
        });
      }
      return this._nodeBaseBean;
    }

    get nodeBase() {
      if (!this._nodeBase) {
        this._nodeBase = ctx.bean.flowDef._getFlowNodeBase(this.contextNode._nodeDef.type);
        if (!this._nodeBase) throw new Error(`flow node not found: ${this.contextNode._nodeDef.type}`);
      }
      return this._nodeBase;
    }

  }
  return FlowNode;
};


/***/ }),

/***/ 716:
/***/ ((module) => {

module.exports = ctx => {
  class Procedure {

    // mode: mine/others/flowing/history
    selectFlows({ iid, userIdWho, where, orders, page, count, mode }) {
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);

      // mode
      if (mode === 'mine') {
        return this._selectFlows_Mine({ iid, userIdWho, where, orders, page, count });
      } else if (mode === 'others' || mode === 'flowing') {
        return this._selectFlows_Others({ iid, userIdWho, where, orders, page, count, mode });
      }
      return this._selectFlows_History({ iid, userIdWho, where, orders, page, count });
    }

    _selectFlows_Mine({ iid, userIdWho, where, orders, page, count }) {
      // -- tables
      // -- a: aFlow
      // -- c: aUser

      // for safe
      where = where ? ctx.model._where(where) : null;
      orders = orders ? ctx.model._orders(orders) : null;
      const limit = page ? ctx.model._limit(page.size, page.index) : null;

      // vars
      let _userWhere;

      //
      const _where = where ? `${where} AND` : ' WHERE';
      const _orders = orders || '';
      const _limit = limit || '';

      // user
      if (userIdWho !== 0) {
        _userWhere = ` and a.flowUserId=${userIdWho}`;
      } else {
        _userWhere = '';
      }

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = `a.id,a.id as flowId,a.createdAt,a.updatedAt,a.deleted,a.iid,a.flowName,a.flowStatus,a.flowAtomId,a.flowNodeIdCurrent,a.flowNodeNameCurrent,a.flowUserId,
            c.userName,c.avatar
          `;
      }

      // sql
      const _sql =
        `select ${_selectFields} from aFlow a
            left join aUser c on a.flowUserId=c.id

          ${_where}
           (
             a.deleted=0 and a.iid=${iid}
             ${_userWhere}
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

    _selectFlows_Others({ iid, userIdWho, where, orders, page, count, mode }) {
      // -- tables
      // -- a: aFlow
      // -- c: aUser
      // -- d: aFlowTaskHistory

      // for safe
      where = where ? ctx.model._where(where) : null;
      orders = orders ? ctx.model._orders(orders) : null;
      const limit = page ? ctx.model._limit(page.size, page.index) : null;

      // vars
      let _userWhere;
      let _modeWhere;

      //
      const _where = where ? `${where} AND` : ' WHERE';
      const _orders = orders || '';
      const _limit = limit || '';

      // user
      if (userIdWho !== 0) {
        _userWhere = ` and exists(select d.id from aFlowTaskHistory d where d.deleted=0 and d.flowId=a.id and d.userIdAssignee=${userIdWho})`;
      } else {
        _userWhere = '';
      }

      // mode
      if (mode === 'others') {
        _modeWhere = ` and a.flowUserId<>${userIdWho}`;
      } else {
        _modeWhere = '';
      }

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = `a.id,a.id as flowId,a.createdAt,a.updatedAt,a.deleted,a.iid,a.flowName,a.flowStatus,a.flowAtomId,a.flowNodeIdCurrent,a.flowNodeNameCurrent,a.flowUserId,
            c.userName,c.avatar
          `;
      }

      // sql
      const _sql =
        `select ${_selectFields} from aFlow a
            left join aUser c on a.flowUserId=c.id

          ${_where}
           (
             a.deleted=0 and a.iid=${iid}
             ${_userWhere}
             ${_modeWhere}
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

    _selectFlows_History({ iid, userIdWho, where, orders, page, count }) {
      // -- tables
      // -- a: aFlowHistory
      // -- c: aUser
      // -- d: aFlowTaskHistory

      // for safe
      where = where ? ctx.model._where(where) : null;
      orders = orders ? ctx.model._orders(orders) : null;
      const limit = page ? ctx.model._limit(page.size, page.index) : null;

      // vars
      let _userWhere;

      //
      const _where = where ? `${where} AND` : ' WHERE';
      const _orders = orders || '';
      const _limit = limit || '';

      // user
      if (userIdWho !== 0) {
        _userWhere = ` and exists(select d.id from aFlowTaskHistory d where d.deleted=0 and d.flowId=a.flowId and d.userIdAssignee=${userIdWho})`;
      } else {
        _userWhere = '';
      }

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = `a.id,a.flowId,a.createdAt,a.updatedAt,a.deleted,a.iid,a.flowName,a.flowStatus,a.flowAtomId,a.flowNodeIdCurrent,a.flowNodeNameCurrent,a.flowUserId,a.timeEnd,a.flowRemark,
            c.userName,c.avatar
          `;
      }

      // sql
      const _sql =
        `select ${_selectFields} from aFlowHistory a
            left join aUser c on a.flowUserId=c.id

          ${_where}
           (
             a.deleted=0 and a.iid=${iid}
             ${_userWhere}
           )

          ${count ? '' : _orders}
          ${count ? '' : _limit}
        `;

      // ok
      return _sql;
    }

  }

  return Procedure;

};


/***/ }),

/***/ 541:
/***/ ((module) => {

module.exports = app => {
  class Queue extends app.meta.BeanBase {

    async execute(context) {
      const { flowDefId } = context.data;
      await this.ctx.bean.flowDef._deployQueue({ flowDefId });
    }

  }

  return Queue;
};


/***/ }),

/***/ 329:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {

    async execute(context) {
      const { user } = context;
      const modelFlow = ctx.model.module(moduleInfo).flow;
      const count = await modelFlow.count({
        flowUserId: user.id,
      });
      return count;
    }

  }

  return Stats;
};


/***/ }),

/***/ 899:
/***/ ((module) => {

module.exports = app => {
  class Version extends app.meta.BeanBase {

    async update(options) {
      if (options.version === 1) {
        let sql;

        // create table: aFlowDef
        sql = `
          CREATE TABLE aFlowDef (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            description varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aFlowDefContent
        sql = `
          CREATE TABLE aFlowDefContent (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            atomId int(11) DEFAULT '0',
            itemId int(11) DEFAULT '0',
            content JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create view: aFlowDefViewFull
        sql = `
          CREATE VIEW aFlowDefViewFull as
            select a.*,b.content from aFlowDef a
              left join aFlowDefContent b on a.id=b.itemId
        `;
        await this.ctx.model.query(sql);

        // create table: aFlow
        //  flowStatus: 1/end
        sql = `
          CREATE TABLE aFlow (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowDefId int(11) DEFAULT '0',
            flowDefKey varchar(255) DEFAULT NULL,
            flowDefRevision int(11) DEFAULT '0',
            flowName varchar(255) DEFAULT NULL,
            flowStatus int(11) DEFAULT '0',
            flowAtomId int(11) DEFAULT '0',
            flowVars JSON DEFAULT NULL,
            flowNodeIdCurrent int(11) DEFAULT '0',
            flowNodeNameCurrent varchar(255) DEFAULT NULL,
            flowUserId int(11) DEFAULT '0',
            timeEnd timestamp DEFAULT NULL,
            flowRemark varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aFlowNode
        sql = `
          CREATE TABLE aFlowNode (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowId int(11) DEFAULT '0',
            flowNodeDefId varchar(255) DEFAULT NULL,
            flowNodeName varchar(255) DEFAULT NULL,
            flowNodeType varchar(50) DEFAULT NULL,
            flowNodeIdPrev int(11) DEFAULT '0',
            nodeVars JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aFlowHistory
        //  flowStatus: 1/end
        sql = `
          CREATE TABLE aFlowHistory (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowId int(11) DEFAULT '0',
            flowDefId int(11) DEFAULT '0',
            flowDefKey varchar(255) DEFAULT NULL,
            flowDefRevision int(11) DEFAULT '0',
            flowName varchar(255) DEFAULT NULL,
            flowStatus int(11) DEFAULT '0',
            flowAtomId int(11) DEFAULT '0',
            flowVars JSON DEFAULT NULL,
            flowNodeIdCurrent int(11) DEFAULT '0',
            flowNodeNameCurrent varchar(255) DEFAULT NULL,
            flowUserId int(11) DEFAULT '0',
            timeEnd timestamp DEFAULT NULL,
            flowRemark varchar(255) DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aFlowNodeHistory
        sql = `
          CREATE TABLE aFlowNodeHistory (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowId int(11) DEFAULT '0',
            flowNodeId int(11) DEFAULT '0',
            flowNodeDefId varchar(255) DEFAULT NULL,
            flowNodeName varchar(255) DEFAULT NULL,
            flowNodeType varchar(50) DEFAULT NULL,
            flowNodeIdPrev int(11) DEFAULT '0',
            flowNodeStatus int(11) DEFAULT '0',
            flowNodeRemark TEXT DEFAULT NULL,
            timeDone timestamp DEFAULT NULL,
            nodeVars JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

      }
    }

    async init(options) {
      if (options.version === 1) {
        // add role rights
        const roleRights = [
          { roleName: 'system', action: 'create' },
          { roleName: 'system', action: 'read', scopeNames: 0 },
          { roleName: 'system', action: 'read', scopeNames: 'superuser' },
          { roleName: 'system', action: 'write', scopeNames: 0 },
          { roleName: 'system', action: 'write', scopeNames: 'superuser' },
          { roleName: 'system', action: 'delete', scopeNames: 0 },
          { roleName: 'system', action: 'delete', scopeNames: 'superuser' },
          { roleName: 'system', action: 'clone', scopeNames: 0 },
          { roleName: 'system', action: 'clone', scopeNames: 'superuser' },
          { roleName: 'system', action: 'enable', scopeNames: 0 },
          { roleName: 'system', action: 'enable', scopeNames: 'superuser' },
          { roleName: 'system', action: 'disable', scopeNames: 0 },
          { roleName: 'system', action: 'disable', scopeNames: 'superuser' },
          { roleName: 'system', action: 'deleteBulk' },
          { roleName: 'system', action: 'exportBulk' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'flowDef', roleRights });
      }
    }

    async test() { }

  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const atomFlowDef = __webpack_require__(885);
const queueDeploy = __webpack_require__(541);
const localContextFlow = __webpack_require__(302);
const localContextNode = __webpack_require__(901);
const localContextEdge = __webpack_require__(88);
const localFlowFlow = __webpack_require__(59);
const localFlowNode = __webpack_require__(154);
const localFlowEdge = __webpack_require__(1);
const localFlowListener = __webpack_require__(408);
const localProcedure = __webpack_require__(716);
const beanFlow = __webpack_require__(869);
const beanFlowDef = __webpack_require__(495);
const statsFlowInitiateds = __webpack_require__(329);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // atom
    'atom.flowDef': {
      mode: 'app',
      bean: atomFlowDef,
    },
    // queue
    'queue.deploy': {
      mode: 'app',
      bean: queueDeploy,
    },
    // local
    'local.context.flow': {
      mode: 'ctx',
      bean: localContextFlow,
    },
    'local.context.node': {
      mode: 'ctx',
      bean: localContextNode,
    },
    'local.context.edge': {
      mode: 'ctx',
      bean: localContextEdge,
    },
    'local.flow.flow': {
      mode: 'ctx',
      bean: localFlowFlow,
    },
    'local.flow.node': {
      mode: 'ctx',
      bean: localFlowNode,
    },
    'local.flow.edge': {
      mode: 'ctx',
      bean: localFlowEdge,
    },
    'local.flow.listener': {
      mode: 'ctx',
      bean: localFlowListener,
    },
    'local.procedure': {
      mode: 'ctx',
      bean: localProcedure,
    },
    // global
    flow: {
      mode: 'ctx',
      bean: beanFlow,
      global: true,
    },
    flowDef: {
      mode: 'ctx',
      bean: beanFlowDef,
      global: true,
    },
    // stats
    'stats.flowInitiateds': {
      mode: 'ctx',
      bean: statsFlowInitiateds,
    },
  };
  return beans;
};


/***/ }),

/***/ 68:
/***/ ((module) => {

module.exports = class FlowEdgeBase {
  constructor(ctx, options) {
    this.ctx = ctx;
    if (options) {
      this.flowInstance = options.flowInstance;
      this.edgeInstance = options.edgeInstance;
      this.context = options.context;
      this.contextNode = options.contextNode;
      this.contextEdge = options.contextEdge;
    }
  }

  async onEdgeEnter() {
    await this.flowInstance._flowListener.onEdgeEnter(this.contextEdge, this.contextNode);
    return true;
  }

  async onEdgeTake() {
    await this.flowInstance._flowListener.onEdgeTake(this.contextEdge, this.contextNode);
    return true;
  }

  async onEdgeLeave() {
    await this.flowInstance._flowListener.onEdgeLeave(this.contextEdge, this.contextNode);
    return true;
  }

};



/***/ }),

/***/ 389:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const extend = require3('extend2');

module.exports = class FlowNodeBase {
  constructor(ctx, options) {
    this.ctx = ctx;
    if (options) {
      this.flowInstance = options.flowInstance;
      this.nodeInstance = options.nodeInstance;
      this.context = options.context;
      this.contextNode = options.contextNode;
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

};



/***/ }),

/***/ 294:
/***/ ((module) => {

module.exports = ({ ctx /* flowInstance*/ }) => {
  class Utils {

    constructor({ context, contextNode, contextEdge }) {
      this.context = context;
      this.contextNode = contextNode;
      this.contextEdge = contextEdge;
    }

    async executeService({ bean, parameter }) {
      const globals = {};
      if (this.context) globals.context = this.context;
      if (this.contextNode) globals.contextNode = this.contextNode;
      if (this.contextEdge) globals.contextEdge = this.contextEdge;
      return await ctx.bean.flow.executeService({
        bean, parameter, globals,
      });
    }

  }
  return Utils;
};


/***/ }),

/***/ 418:
/***/ ((module) => {

module.exports = () => {
  class FlowVars {

    constructor() {
      this._vars = null;
      this._dirty = false;
    }

    get(names) {
      names = names.split('.');
      let value = this._vars;
      for (const name of names) {
        value = value[name];
        if (value === undefined) break;
      }
      return value;
    }

    set(names, value) {
      names = names.split('.');
      let obj = this._vars;
      for (let i = 0; i < names.length - 1; i++) {
        const name = names[i];
        if (obj[name] === undefined) {
          obj[name] = {};
        }
        obj = obj[name];
      }
      const name = names[names.length - 1];
      obj[name] = value;
      // dirty
      this._dirty = true;
    }

  }
  return FlowVars;
};


/***/ }),

/***/ 76:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // queues
  config.queues = {
    deploy: {
      bean: 'deploy',
    },
  };

  return config;
};


/***/ }),

/***/ 479:
/***/ ((module) => {

module.exports = {
  flow: {
    status: {
      flowing: 0,
      end: 1,
    },
  },
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
  1001: 'Flow definition not Found: %s',
  1002: 'Flow definition disabled: %s',
  1003: 'Flow not Found: %s',
  1004: 'Flow Node not Found: %s',
  1005: 'Flow Node definition not Found: %s',
  1006: 'Previous Flow Node not Found: %s',
  1007: 'Role not Found: %s',
  1008: 'Flow Completed: %s',
  1009: 'Flow Outdated: %s',
};


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  FlowTitle: 'Flow',
  WorkFlow: 'Work Flow',
  WorkFlows: 'Work Flows',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  FlowTitle: '流程',
  FlowDefinition: '流程定义',
  WorkFlow: '工作流',
  WorkFlows: '工作流',
  End: '结束',
  Current: '当前',
  Drafting: '起草',
  Review: '评审',
  Pass: '通过',
  Reject: '驳回',
  Passed: '已通过',
  Rejected: '已驳回',
  Cancelled: '已取消',
  'Create FlowDefinition': '新建流程定义',
  'FlowDefinition List': '流程定义列表',
  'Flow definition not Found: %s': '流程定义未发现: %s',
  'Flow definition disabled: %s': '流程定义已禁用: %s',
  'Flow not Found: %s': '流程未发现: %s',
  'Flow Node not Found: %s': '流程节点未发现: %s',
  'Flow Node definition not Found: %s': '流程节点定义未发现: %s',
  'Previous Flow Node not Found: %s': '前置流程节点未发现: %s',
  'Role not Found: %s': '角色未发现: %s',
  'Flow Completed: %s': '流程已结束: %s',
  'Flow Outdated: %s': '流程已过期: %s',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 459:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const workflow = {
    info: {
      title: 'WorkFlows',
      persistence: true,
      uniform: {
        stats: {
          params: {
            module: 'a-message',
            name: 'message',
            nameSub: `${moduleInfo.relativeName}_workflow`,
          },
          color: 'red',
        },
      },
    },
  };
  return workflow;
};


/***/ }),

/***/ 429:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create FlowDefinition',
      atomStaticKey: 'createFlowDef',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.Create',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'flowDef',
        atomAction: 'create',
      }),
      resourceRoles: 'template.system',
    },
    {
      atomName: 'FlowDefinition List',
      atomStaticKey: 'listFlowDef',
      atomRevision: 0,
      atomCategoryId: 'a-base:menu.List',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'flowDef',
        atomAction: 'read',
      }),
      resourceRoles: 'template.system',
    },
  ];
  return resources;
};


/***/ }),

/***/ 232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // flowDef
  schemas.flowDef = {
    type: 'object',
    properties: {
      // title
      groupTitle: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Title',
      },
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      // content
      groupContent: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Content',
      },
      content: {
        type: 'string',
        ebType: 'json',
        ebTextarea: true,
        ebTitle: 'Content',
      },
      // Basic Info
      groupBasicInfo: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Basic Info',
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
      atomCategoryId: {
        type: 'number',
        ebType: 'category',
        ebTitle: 'Category',
      },
      atomTags: {
        type: [ 'string', 'null' ],
        ebType: 'tags',
        ebTitle: 'Tags',
      },
      // Extra
      groupExtra: {
        type: 'null',
        ebType: 'group-flatten',
        ebTitle: 'Extra',
      },
      atomStaticKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'KeyForAtom',
        ebReadOnly: true,
        notEmpty: true,
      },
      atomRevision: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'Revision',
        ebReadOnly: true,
      },
    },
  };
  // flowDef search
  schemas.flowDefSearch = {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 623:
/***/ ((module) => {

module.exports = app => {

  class FlowController extends app.Controller {

    // options
    //   where, orders, page, mode: mine/others/flowing/history
    async select() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.bean.util.page(options.page);
      const items = await this.ctx.service.flow.select({
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async count() {
      const options = this.ctx.request.body.options;
      const count = await this.ctx.service.flow.count({
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(count);
    }

  }
  return FlowController;
};


/***/ }),

/***/ 836:
/***/ ((module) => {

module.exports = app => {

  class FlowDefController extends app.Controller {

  }
  return FlowDefController;
};


/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flow = __webpack_require__(623);
const flowDef = __webpack_require__(836);

module.exports = app => {
  const controllers = {
    flow,
    flowDef,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);
const constants = __webpack_require__(479);
const FlowNodeBase = __webpack_require__(389);
const FlowEdgeBase = __webpack_require__(68);

module.exports = app => {

  // FlowNodeBase/FlowEdgeBase
  app.meta.FlowNodeBase = FlowNodeBase;
  app.meta.FlowEdgeBase = FlowEdgeBase;

  // aops
  const aops = __webpack_require__(224)(app);
  // beans
  const beans = __webpack_require__(187)(app);
  // routes
  const routes = __webpack_require__(825)(app);
  // controllers
  const controllers = __webpack_require__(95)(app);
  // services
  const services = __webpack_require__(214)(app);
  // models
  const models = __webpack_require__(230)(app);
  // meta
  const meta = __webpack_require__(458)(app);

  return {
    aops,
    beans,
    routes,
    controllers,
    services,
    models,
    config,
    locales,
    errors,
    constants,
    meta,
  };

};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const schemas = __webpack_require__(232)(app);
  const staticResources = __webpack_require__(429)(app);
  const socketioWorkflow = __webpack_require__(459)(app);
  const meta = {
    base: {
      atoms: {
        flowDef: {
          info: {
            bean: 'flowDef',
            title: 'FlowDefinition',
            tableName: 'aFlowDef',
            tableNameModes: {
              full: 'aFlowDefViewFull',
            },
            category: true,
            tag: true,
          },
          validator: 'flowDef',
          search: {
            validator: 'flowDefSearch',
          },
        },
      },
      statics: {
        'a-base.resource': {
          items: staticResources,
        },
      },
    },
    validation: {
      validators: {
        flowDef: {
          schemas: 'flowDef',
        },
        flowDefSearch: {
          schemas: 'flowDefSearch',
        },
      },
      keywords: {},
      schemas: {
        flowDef: schemas.flowDef,
        flowDefSearch: schemas.flowDefSearch,
      },
    },
    stats: {
      providers: {
        flowInitiateds: {
          user: true,
          bean: 'flowInitiateds',
        },
      },
    },
    socketio: {
      messages: {
        workflow: socketioWorkflow,
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 436:
/***/ ((module) => {

module.exports = app => {
  class Flow extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlow', options: { disableDeleted: true } });
    }
  }
  return Flow;
};


/***/ }),

/***/ 890:
/***/ ((module) => {

module.exports = app => {
  class FlowDef extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowDef', options: { disableDeleted: false } });
    }
  }
  return FlowDef;
};


/***/ }),

/***/ 986:
/***/ ((module) => {

module.exports = app => {
  class FlowDefContent extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowDefContent', options: { disableDeleted: false } });
    }
  }
  return FlowDefContent;
};


/***/ }),

/***/ 301:
/***/ ((module) => {

module.exports = app => {
  class FlowDefFull extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowDefViewFull', options: { disableDeleted: false } });
    }
  }
  return FlowDefFull;
};


/***/ }),

/***/ 717:
/***/ ((module) => {

module.exports = app => {
  class FlowHistory extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowHistory', options: { disableDeleted: false } });
    }
  }
  return FlowHistory;
};


/***/ }),

/***/ 625:
/***/ ((module) => {

module.exports = app => {
  class FlowNode extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowNode', options: { disableDeleted: true } });
    }
  }
  return FlowNode;
};


/***/ }),

/***/ 515:
/***/ ((module) => {

module.exports = app => {
  class FlowNodeHistory extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowNodeHistory', options: { disableDeleted: false } });
    }
  }
  return FlowNodeHistory;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flowDef = __webpack_require__(890);
const flowDefContent = __webpack_require__(986);
const flowDefFull = __webpack_require__(301);
const flow = __webpack_require__(436);
const flowHistory = __webpack_require__(717);
const flowNode = __webpack_require__(625);
const flowNodeHistory = __webpack_require__(515);

module.exports = app => {
  const models = {
    flowDef,
    flowDefContent,
    flowDefFull,
    flow,
    flowHistory,
    flowNode,
    flowNodeHistory,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // flow
    { method: 'post', path: 'flow/select', controller: 'flow' },
    { method: 'post', path: 'flow/count', controller: 'flow' },
  ];
  return routes;
};


/***/ }),

/***/ 934:
/***/ ((module) => {

module.exports = app => {

  class Flow extends app.Service {

    async select({ options, user }) {
      return await this.ctx.bean.flow.select({ options, user });
    }

    async count({ options, user }) {
      return await this.ctx.bean.flow.count({ options, user });
    }

  }
  return Flow;
};



/***/ }),

/***/ 875:
/***/ ((module) => {

module.exports = app => {

  class FlowDef extends app.Service {

  }
  return FlowDef;
};



/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flow = __webpack_require__(934);
const flowDef = __webpack_require__(875);

module.exports = app => {
  const services = {
    flow,
    flowDef,
  };
  return services;
};


/***/ }),

/***/ 718:
/***/ ((module) => {

"use strict";
module.exports = require("require3");;

/***/ }),

/***/ 184:
/***/ ((module) => {

"use strict";
module.exports = require("vm");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(421);
/******/ })()
;
//# sourceMappingURL=backend.js.map