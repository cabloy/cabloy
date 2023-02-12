const __VARTITLES = {
  flowUser: 'FlowInitiator',
  auto: 'FlowVarAutoPick',
};
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
      const userIds = await this._adjustAssignees_userIds(str);
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
      const roleIds = await this._adjustAssignees_roleIds(str);
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
      const _vars = await this._adjustAssignees_vars(str);
      // title
      return _vars.map(item => {
        const title = __VARTITLES[item] || item;
        // others
        return {
          name: item,
          title,
          titleLocale: ctx.text(title),
        };
      });
    }

    async _adjustAssignees_userIds(str) {
      if (!str) return null;
      if (!Array.isArray(str)) {
        str = str.toString().split(',');
      }
      return str.map(item => {
        return typeof item === 'object' ? item.id : parseInt(item);
      });
    }

    async _adjustAssignees_roleIds(str) {
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

    async _adjustAssignees_vars(str) {
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
