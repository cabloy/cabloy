/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 5224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 9885:
/***/ ((module) => {

module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
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
      await this.ctx.model.flowDefContent.update(
        {
          content: item.content,
        },
        {
          where: {
            atomId: key.atomId,
          },
        }
      );
      // deploy
      if (item.atomStage === 1) {
        await this.ctx.bean.flowDef.deploy({ flowDefId: key.atomId });
      }
    }

    async delete({ atomClass, key, options, user }) {
      // deploy
      const _atom = await this.ctx.bean.atom.modelAtom.get({ id: key.atomId });
      if (_atom.atomStage === 1) {
        await this.ctx.bean.flowDef.deploy({ flowDefId: key.atomId, undeploy: true });
      }
      // super
      await super.delete({ atomClass, key, options, user });
      // delete flowDef
      await this.ctx.model.flowDef.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.flowDefContent.delete({
        itemId: key.itemId,
      });
    }

    async enable({ atomClass, key, user }) {
      // super
      await super.enable({ atomClass, key, user });
      // deploy
      await this.ctx.bean.flowDef.deploy({ flowDefId: key.atomId });
    }

    async disable({ atomClass, key, user }) {
      // super
      await super.disable({ atomClass, key, user });
      // deploy
      await this.ctx.bean.flowDef.deploy({ flowDefId: key.atomId, undeploy: true });
    }

    _getMeta(item) {
      const meta = this._ensureItemMeta(item);
      // meta.flags
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Atom;
};


/***/ }),

/***/ 5869:
/***/ ((module) => {

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
      return ctx.bean.util.evaluateExpression({ expression, globals });
    }

    async executeService({ bean, parameterExpression, parameter, globals }) {
      if (parameterExpression !== undefined) {
        parameter = this.evaluateExpression({ expression: parameterExpression, globals });
      }
      return await this._executeServiceInner({ bean, parameter, globals });
    }

    async _executeServiceInner({ bean, parameter, globals }) {
      if (!bean) throw new Error('flow service bean is not set');
      // bean
      const beanFullName = `${bean.module}.flow.service.${bean.name}`;
      const beanInstance = ctx.bean._getBean(beanFullName);
      if (!beanInstance) throw new Error(`bean not found: ${beanFullName}`);
      if (Object.getPrototypeOf(Object.getPrototypeOf(beanInstance)).constructor.name !== 'FlowServiceBase') {
        throw new Error(`bean should extends FlowServiceBase: ${beanFullName}`);
      }
      // context
      const context = Object.assign({}, globals);
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
        if (flow) {
          flow.id = flowId;
        }
      }
      if (!flow) ctx.throw.module(moduleInfo.relativeName, 1003, flowId);
      // flowDef: by key+revision
      const flowDef = await ctx.bean.flowDef.getByKeyAndRevision({
        flowDefKey: flow.flowDefKey,
        flowDefRevision: flow.flowDefRevision,
      });
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
        if (flowNode) {
          flowNode.id = flowNodeId;
        }
      }
      if (!flowNode) ctx.throw.module(moduleInfo.relativeName, 1004, flowNodeId);
      // load flow
      const flowInstance = await this._loadFlowInstance({ flowId: flowNode.flowId, history });
      // load flow node
      const flowNodeInstance = await flowInstance._loadNodeInstance({ flowNode, history });
      return flowNodeInstance;
    }

    async normalizeAssignees({ users, roles, vars }) {
      const assignees = {};
      assignees.users = await this._normalizeAssignees_users(users);
      assignees.roles = await this._normalizeAssignees_roles(roles);
      assignees.vars = await this._normalizeAssignees_vars(vars);
      return assignees;
    }

    async _normalizeAssignees_users(str) {
      if (!str) return [];
      // userIds
      const userIds = await this._parseAssignees_userIds(str);
      if (userIds.length === 0) return [];
      // select
      return await ctx.bean.user.select({
        options: {
          where: {
            'f.disabled': 0,
            'f.id': userIds,
          },
          orders: [['f.userName', 'asc']],
          removePrivacy: true,
        },
      });
    }

    async _normalizeAssignees_roles(str) {
      if (!str) return [];
      // roleIds
      const roleIds = await this._parseAssignees_roleIds(str);
      if (roleIds.length === 0) return [];
      // select
      return await ctx.bean.role.model.select({
        where: {
          id: roleIds,
        },
      });
    }

    async _normalizeAssignees_vars(str) {
      if (!str) return [];
      // vars
      const _vars = await this._parseAssignees_vars(str);
      // title
      return _vars.map(item => {
        let title;
        if (item === 'flowUser') {
          title = 'FlowInitiator';
        } else {
          title = item;
        }
        // others
        return {
          name: item,
          title,
          titleLocale: ctx.text(title),
        };
      });
    }

    async _parseAssignees_userIds(str) {
      if (!str) return null;
      if (!Array.isArray(str)) {
        str = str.toString().split(',');
      }
      return str.map(item => {
        return typeof item === 'object' ? item.id : parseInt(item);
      });
    }

    async _parseAssignees_roleIds(str) {
      if (!str) return null;
      if (!Array.isArray(str)) {
        str = str.toString().split(',');
      }
      const arr = [];
      for (const item of str) {
        if (typeof item === 'object') {
          // object
          arr.push(item.id);
        } else if (isNaN(item)) {
          // string
          const role = await ctx.bean.role.parseRoleName({ roleName: item });
          if (!role) ctx.throw.module(moduleInfo.relativeName, 1007, item);
          arr.push(role.id);
        } else {
          // number
          arr.push(item);
        }
      }
      // ok
      return arr;
    }

    async _parseAssignees_vars(str) {
      if (!str) return null;
      if (!Array.isArray(str)) {
        str = str.toString().split(',');
      }
      return str.map(item => {
        return typeof item === 'object' ? item.name : item;
      });
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
      const where = {};
      if (history) {
        where['a.flowId'] = flowId;
      } else {
        where['a.id'] = flowId;
      }
      const flows = await this.select({
        options: {
          where,
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
        where,
        orders,
        page,
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

/***/ 5495:
/***/ ((module) => {

const __flowBehaviorBases = {};
const __flowNodeBases = {};
const __flowEdgeBases = {};
const __flowServiceBases = {};

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

    async deploy({ flowDefId, undeploy }) {
      // flowDef
      const flowDef = await this._getById({ flowDefId });
      if (!flowDef) return;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content) return;
      // all startEvents
      for (const node of content.process.nodes) {
        const nodeType = node.type;
        if (nodeType.indexOf('startEvent') === -1) continue;
        const _nodeBase = this._getFlowNodeBase(nodeType);
        const _nodeBaseBean = ctx.bean._newBean(_nodeBase.beanFullName);
        if (_nodeBaseBean.deploy) {
          await _nodeBaseBean.deploy({
            deploy: !undeploy && flowDef.atomDisabled === 0,
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

    behaviorBases() {
      return this._getFlowBehaviorBases();
    }

    nodeBases() {
      return this._getFlowNodeBases();
    }

    edgeBases() {
      return this._getFlowEdgeBases();
    }

    flowServiceBases() {
      return this._getFlowServiceBases();
    }

    _getFlowServiceBases() {
      if (!__flowServiceBases[ctx.locale]) {
        __flowServiceBases[ctx.locale] = this._prepareFlowServiceBases();
      }
      return __flowServiceBases[ctx.locale];
    }

    _getFlowBehaviorBases() {
      if (!__flowBehaviorBases[ctx.locale]) {
        __flowBehaviorBases[ctx.locale] = this._prepareFlowBehaviorBases();
      }
      return __flowBehaviorBases[ctx.locale];
    }

    _getFlowBehaviorBase(behaviorType) {
      return this._getFlowBehaviorBases()[behaviorType];
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

    _prepareFlowServiceBases() {
      const flowServiceBases = {};
      for (const module of ctx.app.meta.modulesArray) {
        const relativeName = module.info.relativeName;
        const beans = module.main.beans;
        if (!beans) continue;
        const res = this._prepareFlowServiceBasesModule(relativeName, beans);
        if (Object.keys(res).length > 0) {
          flowServiceBases[relativeName] = res;
        }
      }
      return flowServiceBases;
    }

    _prepareFlowServiceBasesModule(relativeName, beans) {
      const flowServiceBases = {};
      for (const beanName in beans) {
        if (beanName.indexOf('flow.service.') !== 0) continue;
        // info
        const bean = beans[beanName];
        const serviceBase = {
          title: bean.title,
        };
        if (bean.title) {
          serviceBase.titleLocale = ctx.text(bean.title);
        } else {
          // prompt
          ctx.logger.info('title of flow service bean should not be empty: ', `${relativeName}:${beanName}`);
        }
        // ok
        const beanNameShort = beanName.substr('flow.service.'.length);
        flowServiceBases[beanNameShort] = serviceBase;
      }
      return flowServiceBases;
    }

    _prepareFlowBehaviorBases() {
      const flowBehaviorBases = {};
      for (const module of ctx.app.meta.modulesArray) {
        const behaviors = module.main.meta && module.main.meta.flow && module.main.meta.flow.behaviors;
        if (!behaviors) continue;
        for (const key in behaviors) {
          const behavior = behaviors[key];
          const beanName = behavior.bean;
          let beanFullName;
          if (typeof beanName === 'string') {
            beanFullName = `${module.info.relativeName}.flow.behavior.${beanName}`;
          } else {
            beanFullName = `${beanName.module || module.info.relativeName}.flow.behavior.${beanName.name}`;
          }
          // support fullKey and key
          const fullKey = `${module.info.relativeName}:${key}`;
          flowBehaviorBases[fullKey] = flowBehaviorBases[key] = {
            ...behavior,
            beanFullName,
            titleLocale: ctx.text(behavior.title),
          };
        }
      }
      return flowBehaviorBases;
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
          // support fullKey and key
          const fullKey = `${module.info.relativeName}:${key}`;
          flowNodeBases[fullKey] = flowNodeBases[key] = {
            ...node,
            beanFullName,
            titleLocale: ctx.text(node.title),
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
          // support fullKey and key
          const fullKey = `${module.info.relativeName}:${key}`;
          flowEdgeBases[fullKey] = flowEdgeBases[key] = {
            ...edge,
            beanFullName,
            titleLocale: ctx.text(edge.title),
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

/***/ 6256:
/***/ ((module) => {

module.exports = ctx => {
  class FlowBehavior extends ctx.app.meta.FlowBehaviorBase {
    constructor(options) {
      super(ctx, options);
    }

    getBehaviorDefOptions({ behaviorDefId, options }) {
      return this.nodeInstance.nodeBaseBean.getBehaviorDefOptions({ behaviorDefId, options });
    }

    getNodeDefOptions({ options }) {
      return this.nodeInstance.nodeBaseBean.getNodeDefOptions({ options });
    }

    async enter() {
      return await this.nodeInstance.nodeBaseBean.onNodeEnter();
    }

    async begin() {
      return await this.nodeInstance.nodeBaseBean.onNodeBegin();
    }

    async doing() {
      return await this.nodeInstance.nodeBaseBean.onNodeDoing();
    }

    async end() {
      return await this.nodeInstance.nodeBaseBean.onNodeEnd();
    }

    async leave() {
      const res = await this.nodeInstance.nodeBaseBean.onNodeLeave();
      if (!res) return false;
      // clear with done
      await this.nodeInstance.clear({ flowNodeHandleStatus: 1 });
      // next
      await this.flowInstance.nextEdges({ contextNode: this.contextNode });
      // return false always, means the base(behavior) normal logic has done, shouldnot do anything else more
      return false;
    }

    async clear({ options }) {
      return await this.nodeInstance.nodeBaseBean.onNodeClear({ options });
    }

    async change({ options }) {
      return await this.nodeInstance.nodeBaseBean.onNodeChange({ options });
    }
  }

  return FlowBehavior;
};


/***/ }),

/***/ 6088:
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

/***/ 5302:
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

/***/ 1901:
/***/ ((module) => {

module.exports = ctx => {
  class ContextNode {
    // contextEdge maybe null
    constructor({ context, contextEdge, nodeDef }) {
      this.context = context;
      this.contextEdge = contextEdge;
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

/***/ 6302:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const UtilsFn = __webpack_require__(9294);

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
        context,
        contextNode,
        edgeDef,
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
      await this.flowInstance.nextNode({ contextEdge: this.contextEdge });
      // return true always, means the edge confirmed to be taken
      return true;
    }

    get edgeBaseBean() {
      if (!this._edgeBaseBean) {
        this._edgeBaseBean = ctx.bean._newBean(this.edgeBase.beanFullName, {
          flowInstance: this.flowInstance,
          edgeInstance: this,
          context: this.context,
          contextNode: this.contextNode,
          contextEdge: this.contextEdge,
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

const VarsFn = __webpack_require__(1418);
const UtilsFn = __webpack_require__(9294);

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

    async _endFlow_handleAtom(options) {
      if (!options.atom) return;
      const atomId = this.context._flow.flowAtomId;
      if (!atomId) return;
      if (options.atom.submit) {
        // submit: _submitDirect
        await ctx.bean.atom._submitDirect({
          key: { atomId },
          item: this.context._atom,
          user: { id: this.context._atom.userIdUpdated },
        });
      } else if (options.atom.close) {
        // close draft
        await ctx.bean.atom.closeDraft({
          key: { atomId },
        });
      }
    }

    async _endFlow(options) {
      options = options || {};
      const flowHandleStatus = options.flowHandleStatus || 1;
      const flowRemark = options.flowRemark || null;
      const flowId = this.context._flowId;
      const flowStatus = this.constant.flow.status.end;
      const timeEnd = new Date();
      // check if end
      if (this.context._flow.flowStatus === flowStatus) {
        ctx.throw.module(moduleInfo.relativeName, 1008, flowId);
      }
      // handle atom
      await this._endFlow_handleAtom(options);
      // tail
      ctx.tail(async () => {
        // need not in transaction
        // flow: update fields for onFlowEnd
        this.context._flow.flowStatus = flowStatus;
        this.context._flow.flowHandleStatus = flowHandleStatus;
        this.context._flow.flowRemark = flowRemark;
        this.context._flow.timeEnd = timeEnd;
        await this.modelFlow.delete({ id: flowId });
        // flow history
        this.context._flowHistory.flowStatus = flowStatus;
        this.context._flowHistory.flowHandleStatus = flowHandleStatus;
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
        const title = `${ctx.text.locale(userFlow.locale, 'FlowTitle')} - ${ctx.text.locale(
          userFlow.locale,
          this.context._flow.flowRemark || 'End'
        )}`;
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
        await flowNodeInstance.clear({ flowNodeHandleStatus: 0 });
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

    async _parseAssignees({ users, roles, vars }) {
      // init
      let assignees = [];

      // 1. users
      const _users = await this._parseAssignees_users(users);
      if (_users) {
        assignees = assignees.concat(_users);
      }

      // 2. roles
      const _roles = await this._parseAssignees_roles(roles);
      if (_roles) {
        assignees = assignees.concat(_roles);
      }

      // 3. vars
      const _vars = await this._parseAssignees_vars(vars);
      if (_vars) {
        assignees = assignees.concat(_vars);
      }

      // unique
      assignees = Set.unique(assignees);

      // ok
      return assignees;
    }

    async _parseAssignees_users(str) {
      if (!str) return null;
      return await ctx.bean.flow._parseAssignees_userIds(str);
    }

    async _parseAssignees_roles(str) {
      if (!str) return null;
      // roleIds
      const roleIds = await ctx.bean.flow._parseAssignees_roleIds(str);
      // users
      let users = [];
      for (const roleId of roleIds) {
        const list = await ctx.bean.role.usersOfRoleParent({ roleId, disabled: 0, removePrivacy: true });
        users = users.concat(list.map(item => item.id));
      }
      // ok
      return users;
    }

    async _parseAssignees_vars(str) {
      if (!str) return null;
      // vars
      const _vars = await ctx.bean.flow._parseAssignees_vars(str);
      // users
      let users = [];
      for (const _var of _vars) {
        const userId = await this._parseUserVar({ _var });
        if (userId) {
          if (Array.isArray(userId)) {
            users = users.concat(userId);
          } else {
            users.push(userId);
          }
        }
      }
      // ok
      return users;
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

const require3 = __webpack_require__(5638);
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
      this._flowListener = ctx.bean.util.evaluateExpression({ expression, globals, wrapper: true });
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

/***/ 1154:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flowNode_0 = __webpack_require__(42);
const flowNode_cycle = __webpack_require__(7293);
module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(flowNode_0, [flowNode_cycle], ctx);
};


/***/ }),

/***/ 42:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const VarsFn = __webpack_require__(1418);
const UtilsFn = __webpack_require__(9294);

const __behaviorBaseDef = {
  id: 'behavior_0',
  name: 'Base',
  type: 'base',
};
module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNode {
    // contextEdge maybe null
    constructor({ flowInstance, context, contextEdge, nodeDef }) {
      this.flowInstance = flowInstance;
      this.context = context;
      this.contextEdge = contextEdge;
      this._nodeBase = null;
      this._nodeBaseBean = null;
      this._behaviors = null;
      // context
      this.contextNode = ctx.bean._newBean(`${moduleInfo.relativeName}.local.context.node`, {
        context,
        contextEdge,
        nodeDef,
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
    get behaviors() {
      if (!this._behaviors) {
        this._behaviors = this._prepareBehaviors();
      }
      return this._behaviors;
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
      // behaviorDefId
      const behaviorDefId = (this.contextEdge && this.contextEdge._edgeDef.behavior) || '';
      // flowNode
      const data = {
        flowId: this.context._flowId,
        flowNodeDefId: this.contextNode._nodeDef.id,
        flowNodeName: this.contextNode._nodeDef.name,
        flowNodeType: this.contextNode._nodeDef.type,
        flowNodeIdPrev,
        nodeVars: '{}',
        behaviorDefId,
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
      this.contextNode._nodeVars._vars = this.contextNode._flowNodeHistory.nodeVars
        ? JSON.parse(this.contextNode._flowNodeHistory.nodeVars)
        : {};
      // utils
      this.contextNode._utils = new (UtilsFn({ ctx, flowInstance: this.flowInstance }))({
        context: this.context,
        contextNode: this.contextNode,
        contextEdge: this.contextEdge,
      });
    }

    _prepareBehaviors() {
      // nodeDef
      const nodeDef = this.contextNode._nodeDef;
      // behaviorsDef
      const behaviorsDef = nodeDef.behaviors || [];
      // behaviors
      const behaviors = behaviorsDef.map(behaviorDef => this._prepareBehavior(behaviorDef));
      // behavior base
      behaviors.push(this._prepareBehavior(__behaviorBaseDef));
      // ok
      return behaviors;
    }

    _prepareBehavior(behaviorDef) {
      const behaviorBase = ctx.bean.flowDef._getFlowBehaviorBase(behaviorDef.type);
      const behaviorBean = ctx.bean._newBean(behaviorBase.beanFullName, {
        flowInstance: this.flowInstance,
        nodeInstance: this,
        context: this.context,
        contextNode: this.contextNode,
        contextEdge: this.contextEdge,
        behaviorDef,
        behaviorBase,
      });
      return {
        behaviorDef,
        behaviorBase,
        behaviorBean,
      };
    }

    async _saveNodeVars() {
      if (!this.contextNode._nodeVars._dirty) return;
      // flowNode
      this.contextNode._flowNode.nodeVars = JSON.stringify(this.contextNode._nodeVars._vars);
      // modelFlowNode maybe deleted when flowNodeStatus=1
      if (this.contextNode._flowNodeHistory.flowNodeStatus === 0) {
        await this.modelFlowNode.update(this.contextNode._flowNode);
      }
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
      options = options || {};
      let flowNodeRemark;
      let timeDone;
      const flowNodeHandleStatus = options.flowNodeHandleStatus || 0;
      if (flowNodeHandleStatus > 0) {
        flowNodeRemark = options.flowNodeRemark || null;
        timeDone = new Date();
        // clear the current node
        await this._setCurrent(true);
      } else {
        flowNodeRemark = null;
        timeDone = null;
      }
      // delete node
      this.contextNode._flowNode.flowNodeStatus = 1;
      this.contextNode._flowNode.flowNodeHandleStatus = flowNodeHandleStatus;
      this.contextNode._flowNode.flowNodeRemark = flowNodeRemark;
      this.contextNode._flowNode.timeDone = timeDone;
      await this.modelFlowNode.delete({ id: this.contextNode._flowNodeId });
      // set nodeHistoryStatus
      this.contextNode._flowNodeHistory.flowNodeStatus = 1;
      this.contextNode._flowNodeHistory.flowNodeHandleStatus = flowNodeHandleStatus;
      this.contextNode._flowNodeHistory.flowNodeRemark = flowNodeRemark;
      this.contextNode._flowNodeHistory.timeDone = timeDone;
      await this.modelFlowNodeHistory.update(this.contextNode._flowNodeHistory);
      // ok
      return true;
    }

    get nodeBaseBean() {
      if (!this._nodeBaseBean) {
        this._nodeBaseBean = ctx.bean._newBean(this.nodeBase.beanFullName, {
          flowInstance: this.flowInstance,
          nodeInstance: this,
          context: this.context,
          contextNode: this.contextNode,
          contextEdge: this.contextEdge,
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

/***/ 7293:
/***/ ((module) => {

const __adapter = (context, chain) => {
  return {
    receiver: chain.behaviorBean,
    fn: chain.behaviorBean[context.methodName],
  };
};

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNode {
    getBehaviorDefOptions({ behaviorDefId }) {
      // nodeDef
      const nodeDef = this.contextNode._nodeDef;
      // behaviorDef
      let behaviorDef;
      if (nodeDef.behaviors) {
        behaviorDef = nodeDef.behaviors.find(item => item.id === behaviorDefId);
      }
      // options
      let options = (behaviorDef && behaviorDef.options) || {};
      // default
      const behavior = this.behaviors.find(item => item.behaviorDef.id === behaviorDefId);
      const optionsDefault = behavior.behaviorBase.options.default;
      if (optionsDefault) {
        options = ctx.bean.util.extend({}, optionsDefault, options);
      }
      // invoke
      return this._behaviorsInvoke({
        methodName: 'getBehaviorDefOptions',
        behaviorDefId,
        options,
      });
    }

    getNodeDefOptions() {
      // nodeDef
      const nodeDef = this.contextNode._nodeDef;
      // options
      let options = nodeDef.options || {};
      // default
      const optionsDefault = this.nodeBase.options.default;
      if (optionsDefault) {
        options = ctx.bean.util.extend({}, optionsDefault, options);
      }
      // invoke
      return this._behaviorsInvoke({
        methodName: 'getNodeDefOptions',
        options,
      });
    }

    async enter() {
      // current
      await this._setCurrent();
      const res = await this._behaviorsInvokeAsync({
        methodName: 'enter',
      });
      await this._saveVars();
      if (!res) return false;
      return await this.begin();
    }

    async begin() {
      const res = await this._behaviorsInvokeAsync({
        methodName: 'begin',
      });
      await this._saveVars();
      if (!res) return false;
      return await this.doing();
    }

    async doing() {
      const res = await this._behaviorsInvokeAsync({
        methodName: 'doing',
      });
      await this._saveVars();
      if (!res) return false;
      return await this.end();
    }

    async end() {
      const res = await this._behaviorsInvokeAsync({
        methodName: 'end',
      });
      await this._saveVars();
      if (!res) return false;
      return await this.leave();
    }

    async leave() {
      const res = await this._behaviorsInvokeAsync({
        methodName: 'leave',
      });
      await this._saveVars();
      return res;
    }

    async clear(options) {
      const res = await this._behaviorsInvokeAsync({
        methodName: 'clear',
        options,
      });
      await this._saveVars();
      if (!res) return false;
      return await this._clear(options);
    }

    async change(options) {
      const res = await this._behaviorsInvokeAsync({
        methodName: 'change',
        options,
      });
      await this._saveVars();
      return res;
    }

    _behaviorsInvoke(context) {
      return ctx.app.meta.util.compose(this.behaviors, __adapter)(context);
    }

    async _behaviorsInvokeAsync(context) {
      return await ctx.app.meta.util.composeAsync(this.behaviors, __adapter)(context);
    }
  }
  return FlowNode;
};


/***/ }),

/***/ 2716:
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
      const _sql = `select ${_selectFields} from aFlow a
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
      const _sql = `select ${_selectFields} from aFlow a
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
        _selectFields = `a.id,a.flowId,a.createdAt,a.updatedAt,a.deleted,a.iid,a.flowName,a.flowStatus,a.flowAtomId,a.flowNodeIdCurrent,a.flowNodeNameCurrent,a.flowUserId,a.timeEnd,a.flowHandleStatus,a.flowRemark,
            c.userName,c.avatar
          `;
      }

      // sql
      const _sql = `select ${_selectFields} from aFlowHistory a
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

/***/ 5329:
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

/***/ 6899:
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

      if (options.version === 2) {
        let sql;

        // alter table: aFlow
        sql = `
        ALTER TABLE aFlow
          ADD COLUMN flowHandleStatus int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);

        // alter table: aFlowHistory
        sql = `
        ALTER TABLE aFlowHistory
          ADD COLUMN flowHandleStatus int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);

        // alter table: aFlowNode
        sql = `
        ALTER TABLE aFlowNode
          ADD COLUMN flowNodeHandleStatus int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);

        // alter table: aFlowNodeHistory
        sql = `
        ALTER TABLE aFlowNodeHistory
          ADD COLUMN flowNodeHandleStatus int(11) DEFAULT '0'
                  `;
        await this.ctx.model.query(sql);
      }

      if (options.version === 3) {
        let sql;

        // alter table: aFlowNode
        sql = `
        ALTER TABLE aFlowNode
          ADD COLUMN behaviorDefId varchar(255) DEFAULT '' 
                  `;
        await this.ctx.model.query(sql);

        // alter table: aFlowNodeHistory
        sql = `
        ALTER TABLE aFlowNodeHistory
          ADD COLUMN behaviorDefId varchar(255) DEFAULT ''
                  `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {
      if (options.version === 1) {
        // // add role rights
        // const roleRights = [
        //   { roleName: 'system', action: 'create' },
        //   { roleName: 'system', action: 'read', scopeNames: 0 },
        //   { roleName: 'system', action: 'read', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'write', scopeNames: 0 },
        //   { roleName: 'system', action: 'write', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'delete', scopeNames: 0 },
        //   { roleName: 'system', action: 'delete', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'clone', scopeNames: 0 },
        //   { roleName: 'system', action: 'clone', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'enable', scopeNames: 0 },
        //   { roleName: 'system', action: 'enable', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'disable', scopeNames: 0 },
        //   { roleName: 'system', action: 'disable', scopeNames: 'superuser' },
        //   { roleName: 'system', action: 'deleteBulk' },
        //   { roleName: 'system', action: 'exportBulk' },
        // ];
        // await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'flowDef', roleRights });
      }

      if (options.version === 4) {
        // add role rights
        const roleRights = [
          { roleName: 'system', action: 'create' },
          { roleName: 'system', action: 'read', scopeNames: 0 },
          { roleName: 'system', action: 'read', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'write', scopeNames: 0 },
          { roleName: 'system', action: 'write', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'delete', scopeNames: 0 },
          { roleName: 'system', action: 'delete', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'clone', scopeNames: 0 },
          { roleName: 'system', action: 'clone', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'enable', scopeNames: 0 },
          { roleName: 'system', action: 'enable', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'disable', scopeNames: 0 },
          { roleName: 'system', action: 'disable', scopeNames: 'authenticated' },
          { roleName: 'system', action: 'deleteBulk' },
          { roleName: 'system', action: 'exportBulk' },
        ];
        await this.ctx.bean.role.addRoleRightBatch({ atomClassName: 'flowDef', roleRights });
      }
    }

    async test() {
      // flowHistory
      let res = await this.ctx.model.flowHistory.insert({});
      await this.ctx.model.flowHistory.delete({ id: res.insertId });
      // flowNodeHistory
      res = await this.ctx.model.flowNodeHistory.insert({});
      await this.ctx.model.flowNodeHistory.delete({ id: res.insertId });
    }
  }

  return Version;
};


/***/ }),

/***/ 5187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(6899);
const atomFlowDef = __webpack_require__(9885);
const flowBehaviorBase = __webpack_require__(6256);
const localContextFlow = __webpack_require__(5302);
const localContextNode = __webpack_require__(1901);
const localContextEdge = __webpack_require__(6088);
const localFlowFlow = __webpack_require__(59);
const localFlowNode = __webpack_require__(1154);
const localFlowEdge = __webpack_require__(6302);
const localFlowListener = __webpack_require__(408);
const localProcedure = __webpack_require__(2716);
const beanFlow = __webpack_require__(5869);
const beanFlowDef = __webpack_require__(5495);
const statsFlowInitiateds = __webpack_require__(5329);

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
    // flow behavior
    'flow.behavior.base': {
      mode: 'ctx',
      bean: flowBehaviorBase,
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

/***/ 7959:
/***/ ((module) => {

module.exports = class FlowBehaviorBase {
  constructor(ctx, options) {
    this.ctx = ctx;
    if (options) {
      this.flowInstance = options.flowInstance;
      this.nodeInstance = options.nodeInstance;
      this.context = options.context;
      this.contextNode = options.contextNode;
      this.contextEdge = options.contextEdge;
      this._behaviorDef = options.behaviorDef;
      this._behaviorBase = options.behaviorBase;
    }
  }

  getBehaviorDefOptions(context, next) {
    return next();
  }

  getNodeDefOptions(context, next) {
    return next();
  }

  async enter(context, next) {
    return await next();
  }

  async begin(context, next) {
    return await next();
  }

  async doing(context, next) {
    return await next();
  }

  async end(context, next) {
    return await next();
  }

  async leave(context, next) {
    return await next();
  }

  async clear(context, next) {
    return await next();
  }

  async change(context, next) {
    return await next();
  }
};


/***/ }),

/***/ 5068:
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

/***/ 6389:
/***/ ((module) => {

module.exports = class FlowNodeBase {
  constructor(ctx, options) {
    this.ctx = ctx;
    if (options) {
      this.flowInstance = options.flowInstance;
      this.nodeInstance = options.nodeInstance;
      this.context = options.context;
      this.contextNode = options.contextNode;
      this.contextEdge = options.contextEdge;
    }
  }

  getBehaviorDefOptions({ behaviorDefId, options }) {
    return this.flowInstance._flowListener.getBehaviorDefOptions(this.contextNode, { behaviorDefId, options });
  }

  getNodeDefOptions({ options }) {
    return this.flowInstance._flowListener.getNodeDefOptions(this.contextNode, { options });
  }

  async onNodeEnter() {
    const res = await this.flowInstance._flowListener.onNodeEnter(this.contextNode);
    if (res === false) return false;
    return true;
  }

  async onNodeBegin() {
    const res = await this.flowInstance._flowListener.onNodeBegin(this.contextNode);
    if (res === false) return false;
    return true;
  }

  async onNodeDoing() {
    const res = await this.flowInstance._flowListener.onNodeDoing(this.contextNode);
    if (res === false) return false;
    return true;
  }

  async onNodeEnd() {
    const res = await this.flowInstance._flowListener.onNodeEnd(this.contextNode);
    if (res === false) return false;
    return true;
  }

  async onNodeLeave() {
    const res = await this.flowInstance._flowListener.onNodeLeave(this.contextNode);
    if (res === false) return false;
    return true;
  }

  async onNodeClear({ options }) {
    const res = await this.flowInstance._flowListener.onNodeClear(this.contextNode, { options });
    if (res === false) return false;
    return true;
  }

  async onNodeChange({ options }) {
    // should not raise onNodeChange for flowListener
    // await this.flowInstance._flowListener.onNodeChange(this.contextNode, { options });
    return true;
  }
};


/***/ }),

/***/ 9294:
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
        bean,
        parameter,
        globals,
      });
    }
  }
  return Utils;
};


/***/ }),

/***/ 1418:
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

/***/ 7076:
/***/ ((module) => {

// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};
  return config;
};


/***/ }),

/***/ 4479:
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

/***/ 5624:
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
  1010: 'NoMatchedFlowEdge: %s',
};


/***/ }),

/***/ 7257:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const defaults = __webpack_require__(3614);

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const behaviors = {
    // base
    base: {
      title: 'Base',
      bean: 'base',
    },
  };

  for (const key in behaviors) {
    const behavior = behaviors[key];
    behavior.options = {};
    if (defaults[key]) {
      behavior.options.default = defaults[key];
    }
  }

  return behaviors;
};


/***/ }),

/***/ 3614:
/***/ ((module) => {

module.exports = {
  base: {},
};


/***/ }),

/***/ 6327:
/***/ ((module) => {

module.exports = {
  FlowTitle: 'Flow',
  WorkFlow: 'Work Flow',
  WorkFlows: 'Work Flows',
  FlowDefinitions: 'Work Flow Definitions',
  FlowInitiator: 'Flow Initiator',
  'NoMatchedFlowEdge: %s': 'No matched flow edge: %s',
};


/***/ }),

/***/ 3072:
/***/ ((module) => {

module.exports = {
  FlowTitle: '流程',
  FlowDefinition: '流程定义',
  WorkFlow: '工作流',
  WorkFlows: '工作流',
  FlowDefinitions: '工作流定义',
  End: '结束',
  Current: '当前',
  Drafting: '起草',
  Review: '评审',
  Pass: '通过',
  Reject: '驳回',
  Passed: '已通过',
  Rejected: '已驳回',
  Cancelled: '已取消',
  FlowInitiator: '流程发起人',
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
  'NoMatchedFlowEdge: %s': '没有匹配的边: %s',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(6327),
  'zh-cn': __webpack_require__(3072),
};


/***/ }),

/***/ 4836:
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

/***/ 5429:
/***/ ((module) => {

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // menu
    {
      atomName: 'Create FlowDefinition',
      atomStaticKey: 'createFlowDef',
      atomRevision: -1,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'flowDef',
        atomAction: 'create',
      }),
      resourceIcon: '::flow-chart',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
    {
      atomName: 'FlowDefinitions',
      atomStaticKey: 'listFlowDef',
      atomRevision: 2,
      atomCategoryId: 'a-base:menu.BasicProfile',
      resourceType: 'a-base:menu',
      resourceConfig: JSON.stringify({
        module: moduleInfo.relativeName,
        atomClassName: 'flowDef',
        atomAction: 'read',
      }),
      resourceIcon: '::flow-chart',
      appKey: 'a-appbooster:appSystem',
      resourceRoles: 'template.system',
    },
  ];
  return resources;
};


/***/ }),

/***/ 8232:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // flowDef
  schemas.flowDef = {
    type: 'object',
    properties: {
      // title
      __groupTitle: {
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
      __groupContent: {
        ebType: 'group-flatten',
        ebTitle: 'Content',
      },
      content: {
        type: 'string',
        ebType: 'component',
        ebTitle: 'Content',
        ebRender: {
          module: 'a-flowchart',
          name: 'renderFlowDefContent',
        },
      },
      // Basic Info
      __groupBasicInfo: {
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
        type: ['string', 'null'],
        ebType: 'tags',
        ebTitle: 'Tags',
      },
      // Extra
      __groupExtra: {
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

/***/ 6836:
/***/ ((module) => {

module.exports = app => {
  class FlowDefController extends app.Controller {
    behaviorBases() {
      const res = this.ctx.service.flowDef.behaviorBases();
      this.ctx.success(res);
    }

    nodeBases() {
      const res = this.ctx.service.flowDef.nodeBases();
      this.ctx.success(res);
    }

    edgeBases() {
      const res = this.ctx.service.flowDef.edgeBases();
      this.ctx.success(res);
    }

    flowServiceBases() {
      const res = this.ctx.service.flowDef.flowServiceBases();
      this.ctx.success(res);
    }
  }
  return FlowDefController;
};


/***/ }),

/***/ 7095:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flow = __webpack_require__(623);
const flowDef = __webpack_require__(6836);

module.exports = app => {
  const controllers = {
    flow,
    flowDef,
  };
  return controllers;
};


/***/ }),

/***/ 9421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(7076);
const locales = __webpack_require__(25);
const errors = __webpack_require__(5624);
const constants = __webpack_require__(4479);
const FlowBehaviorBase = __webpack_require__(7959);
const FlowNodeBase = __webpack_require__(6389);
const FlowEdgeBase = __webpack_require__(5068);

module.exports = app => {
  // FlowBehaviorBase/FlowNodeBase/FlowEdgeBase
  app.meta.FlowBehaviorBase = FlowBehaviorBase;
  app.meta.FlowNodeBase = FlowNodeBase;
  app.meta.FlowEdgeBase = FlowEdgeBase;

  // aops
  const aops = __webpack_require__(5224)(app);
  // beans
  const beans = __webpack_require__(5187)(app);
  // routes
  const routes = __webpack_require__(3825)(app);
  // controllers
  const controllers = __webpack_require__(7095)(app);
  // services
  const services = __webpack_require__(7214)(app);
  // models
  const models = __webpack_require__(3230)(app);
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
  const schemas = __webpack_require__(8232)(app);
  const staticResources = __webpack_require__(5429)(app);
  const socketioWorkflow = __webpack_require__(4836)(app);
  const flowBehaviors = __webpack_require__(7257)(app);
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
            inner: true,
            category: true,
            tag: true,
            comment: false,
            attachment: false,
          },
          actions: {
            write: {
              enableOnStatic: true,
            },
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
    flow: {
      behaviors: flowBehaviors,
    },
  };
  return meta;
};


/***/ }),

/***/ 8436:
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

/***/ 2890:
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

/***/ 6986:
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

/***/ 6717:
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

/***/ 9625:
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

/***/ 3230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flowDef = __webpack_require__(2890);
const flowDefContent = __webpack_require__(6986);
const flowDefFull = __webpack_require__(301);
const flow = __webpack_require__(8436);
const flowHistory = __webpack_require__(6717);
const flowNode = __webpack_require__(9625);
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

/***/ 3825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // flow
    { method: 'post', path: 'flow/select', controller: 'flow' },
    { method: 'post', path: 'flow/count', controller: 'flow' },
    // flowDef
    { method: 'post', path: 'flowDef/behaviorBases', controller: 'flowDef' },
    { method: 'post', path: 'flowDef/nodeBases', controller: 'flowDef' },
    { method: 'post', path: 'flowDef/edgeBases', controller: 'flowDef' },
    { method: 'post', path: 'flowDef/flowServiceBases', controller: 'flowDef' },
  ];
  return routes;
};


/***/ }),

/***/ 4934:
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

/***/ 6875:
/***/ ((module) => {

module.exports = app => {
  class FlowDef extends app.Service {
    behaviorBases() {
      return this.ctx.bean.flowDef.behaviorBases();
    }

    nodeBases() {
      return this.ctx.bean.flowDef.nodeBases();
    }

    edgeBases() {
      return this.ctx.bean.flowDef.edgeBases();
    }

    flowServiceBases() {
      return this.ctx.bean.flowDef.flowServiceBases();
    }
  }
  return FlowDef;
};


/***/ }),

/***/ 7214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flow = __webpack_require__(4934);
const flowDef = __webpack_require__(6875);

module.exports = app => {
  const services = {
    flow,
    flowDef,
  };
  return services;
};


/***/ }),

/***/ 5638:
/***/ ((module) => {

"use strict";
module.exports = require("require3");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(9421);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=backend.js.map