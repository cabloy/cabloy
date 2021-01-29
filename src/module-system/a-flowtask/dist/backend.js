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

/***/ 302:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {

    get modelFlowTask() {
      return ctx.model.module(moduleInfo.relativeName).flowTask;
    }
    get modelFlowTaskHistory() {
      return ctx.model.module(moduleInfo.relativeName).flowTaskHistory;
    }

    get sqlProcedure() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.procedure');
    }

    async count({ options, user }) {
      return await this.select({ options, user, count: 1 });
    }

    async select({ options, user, pageForce = true, count = 0 }) {
      const tasks = await this._list({ options, user, pageForce, count });
      // loop
      for (const task of tasks) {
        // locale
        task.flowNodeNameLocale = ctx.text(task.flowNodeName);
        if (task.flowNodeRemark) {
          task.flowNodeRemarkLocale = ctx.text(task.flowNodeRemark);
        }
        if (task.handleRemark) {
          task.handleRemarkLocale = ctx.text(task.handleRemark);
        }
      }
      return tasks;
    }

    async claim({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      return await taskInstance._claim();
    }

    async complete({ flowTaskId, handle, formAtom, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._complete({ handle, formAtom });
    }

    async assignees({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      return await taskInstance._assignees();
    }

    async assigneesConfirmation({ flowTaskId, handle, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._assigneesConfirmation({ handle });
    }

    async cancelFlow({ flowTaskId, handle, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._cancelFlow({ handle });
    }

    async actions({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      return await taskInstance._actions();
    }

    // from history
    async viewAtom({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user, history: true });
      return await taskInstance._viewAtom();
    }

    // from runtime
    async editAtom({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user, history: false });
      return await taskInstance._editAtom();
    }

    async _nodeDoneCheckLock({ flowNodeId /* user*/ }) {
      // load flow node
      const nodeInstance = await ctx.bean.flow._loadFlowNodeInstance({ flowNodeId });
      // options
      const options = this._getNodeDefOptionsTask({ nodeInstance });
      // completionCondition
      const completionCondition = options.completionCondition;
      // task count
      const taskCountTotal = await this.modelFlowTask.count({
        flowNodeId,
      });
      if (taskCountTotal === 0) {
        // means node has been checked and done
        // XX //   should throw error to deny the db changed for tasks has been deleted.
        // XX ctx.throw.module('a-flow', 1004, flowNodeId);
        // neednot throw error for this method is called in ctx.tail
        return;
      }
      const taskCountPassed = await this.modelFlowTask.count({
        flowNodeId, flowTaskStatus: 1, handleStatus: 1,
      });
      const taskCountRejected = await this.modelFlowTask.count({
        flowNodeId, flowTaskStatus: 1, handleStatus: 2,
      });
      // check passed
      if (typeof completionCondition.passed === 'number' || completionCondition.passed.indexOf('%') === -1) {
        // absolute value
        if (taskCountPassed >= parseInt(completionCondition.passed)) {
          return await this._nodeDoneCheckLock_passed({ nodeInstance });
        }
      } else {
        // percent value
        if (taskCountPassed / taskCountTotal >= parseInt(completionCondition.passed) / 100) {
          return await this._nodeDoneCheckLock_passed({ nodeInstance });
        }
      }
      // check rejected
      if (typeof completionCondition.rejected === 'number' || completionCondition.rejected.indexOf('%') === -1) {
        // absolute value
        if (taskCountRejected >= parseInt(completionCondition.rejected)) {
          return await this._nodeDoneCheckLock_rejected({ nodeInstance, options });
        }
      } else {
        // percent value
        if (taskCountRejected / taskCountTotal >= parseInt(completionCondition.rejected) / 100) {
          return await this._nodeDoneCheckLock_rejected({ nodeInstance, options });
        }
      }
      // here means not done
    }

    async _nodeDoneCheckLock_passed({ nodeInstance }) {
      // delete tasks
      await this._nodeDoneCheckLock_deleteTasks({ nodeInstance });
      // next stage of flow node: end
      return await nodeInstance.end();
    }

    async _nodeDoneCheckLock_rejected({ nodeInstance, options }) {
      // rejectedNode
      return await this._gotoFlowNodePrevious({ nodeInstance, rejectedNode: options.rejectedNode });
    }

    async _gotoFlowNodePrevious({ nodeInstance, rejectedNode }) {
      // flowNodeId
      const flowNodeId = nodeInstance.contextNode._flowNodeId;
      // rejectedNode
      if (!rejectedNode) {
        // find previous task node
        const flowNode = await this._findFlowNodeHistoryPrevious({ nodeInstance });
        if (!flowNode) ctx.throw.module('a-flow', 1006, flowNodeId);
        rejectedNode = flowNode.flowNodeDefId;
      }
      // nodeInstancePrev
      const nodeInstancePrev = await nodeInstance.flowInstance._findNodeInstanceNext({
        nodeDefId: rejectedNode,
        flowNodeIdPrev: flowNodeId,
      });
      // delete tasks
      await this._nodeDoneCheckLock_deleteTasks({ nodeInstance });
      // clear & enter
      await nodeInstance._clear({ flowNodeRemark: 'Rejected' });
      return await nodeInstancePrev.enter();
    }

    async _findFlowNodeHistoryPrevious({ nodeInstance }) {
      // flowNodeId
      const flowNodeId = nodeInstance.contextNode._flowNodeId;
      return await nodeInstance.flowInstance._findFlowNodeHistoryPrevious({
        flowNodeId, cb: ({ /* flowNode*/ nodeDef }) => {
          return nodeDef.type === 'startEventAtom' || nodeDef.type === 'activityUserTask';
        },
      });
    }

    async _nodeDoneCheckLock_deleteTasks({ nodeInstance }) {
      await this._clearRemains({ nodeInstance });
    }

    async _list({ options: { where, orders, page, mode, history = 0 }, user, pageForce = true, count = 0 }) {
      // special for mode
      if (mode === 'claimings') {
        where['a.flowTaskStatus'] = 0;
        where['a.timeClaimed'] = null;
        history = 0;
      } else if (mode === 'handlings') {
        where['a.flowTaskStatus'] = 0;
        where['a.timeClaimed'] = { op: 'notNull' };
        history = 0;
      } else if (mode === 'completeds') {
        where['a.flowTaskStatus'] = 1;
        history = 1;
      }
      // page
      page = ctx.bean.util.page(page, pageForce);
      // select
      const sql = this.sqlProcedure.selectTasks({
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
        where, orders, page,
        count,
        history,
      });
      const res = await ctx.model.query(sql);
      return count ? res[0]._count : res;
    }

    async _loadTaskInstance({ flowTaskId, user, history }) {
      // get
      let flowTask;
      if (!history) {
        flowTask = await this.modelFlowTask.get({ id: flowTaskId });
      } else {
        flowTask = await this.modelFlowTaskHistory.get({ flowTaskId });
      }
      if (!flowTask) ctx.throw.module(moduleInfo.relativeName, 1001, flowTaskId);
      // load flow node
      const nodeInstance = await ctx.bean.flow._loadFlowNodeInstance({ flowNodeId: flowTask.flowNodeId, history });
      // load task
      const task = this._createTaskInstance2({ nodeInstance });
      await task._load({ flowTask, user, history });
      return task;
    }

    _createTaskInstance2({ nodeInstance }) {
      const task = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.task`, {
        nodeInstance,
      });
      return task;
    }

    async _createTaskInstance({ nodeInstance, userIdAssignee, user }) {
      const task = this._createTaskInstance2({ nodeInstance });
      await task.init({ userIdAssignee, user });
      return task;
    }

    _getNodeDefOptionsTask({ nodeInstance }) {
      // nodeDef
      const nodeDef = nodeInstance.contextNode._nodeDef;
      // options
      const options = nodeInstance.getNodeDefOptions();
      return nodeDef.type === 'startEventAtom' ? options.task : options;
    }

    async _clearRemains({ nodeInstance }) {
      const flowNodeId = nodeInstance.contextNode._flowNodeId;
      // notify
      const _tasks = await this.modelFlowTask.select({
        where: { flowNodeId },
      });
      for (const _task of _tasks) {
        this._notifyTaskClaimings(_task.userIdAssignee);
        this._notifyTaskHandlings(_task.userIdAssignee);
      }
      // flowTask delete
      await this.modelFlowTask.delete({ flowNodeId });
      // flowTaskHistory close
      //    flowTaskStatus:1
      //    handleStatus: not changed
      await ctx.model.query(`
        update aFlowTaskHistory set flowTaskStatus=1
          where iid=? and deleted=0 and flowNodeId=? and flowTaskStatus=0
        `, [ ctx.instance.id, flowNodeId ]);
    }

    _notifyTaskClaimings(userId) {
      if (userId) {
        ctx.bean.stats.notify({
          module: moduleInfo.relativeName,
          name: 'taskClaimings',
          user: { id: userId },
        });
      }
    }

    _notifyTaskHandlings(userId) {
      if (userId) {
        ctx.bean.stats.notify({
          module: moduleInfo.relativeName,
          name: 'taskHandlings',
          user: { id: userId },
        });
      }
    }

  }

  return FlowTask;
};


/***/ }),

/***/ 892:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const FlowNodeActivityUserTaskBase = __webpack_require__(271);

module.exports = ctx => {
  class FlowNode extends FlowNodeActivityUserTaskBase(ctx) {
  }

  return FlowNode;
};


/***/ }),

/***/ 252:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const FlowNodeActivityUserTaskBase = __webpack_require__(271);

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNode extends FlowNodeActivityUserTaskBase(ctx) {

    get modelCondition() {
      return ctx.model.module(moduleInfo.relativeName).flowNodeStartEventAtomCondition;
    }

    async deploy({ deploy, flowDefId, node }) {
      if (deploy) {
        await this._addCondition({ flowDefId, node });
      } else {
        // donot delete condition
      }
    }

    async onNodeDoing() {
      // super
      await super.onNodeDoing();
      // auto handle
      await this._autoHandle();
      // break
      return false;
    }

    async _autoHandle() {
      const flowId = this.context._flowId;
      // select
      const tasks = await ctx.bean.flowTask.select({
        options: {
          where: {
            'a.flowId': flowId,
            'a.flowTaskStatus': 0,
          },
          history: 0,
        } });
      const task = tasks[0];
      const flowTaskId = task.id;
      const user = { id: task.userIdAssignee };
      // claim automatically always
      await ctx.bean.flowTask.claim({ flowTaskId, user });
      // complete automatically only on first-in
      if (this.contextNode._flowNode.flowNodeIdPrev === 0) {
        await ctx.bean.flowTask.complete({
          flowTaskId,
          handle: { status: 1 },
          user,
        });
      }
    }

    async _addCondition({ flowDefId, node }) {
      const atom = node.options && node.options.atom;
      if (!atom) throw new Error(`atom not set for startEventAtom: ${flowDefId}.${node.id}`);
      // atomClass
      const atomClass = await ctx.bean.atomClass.get({
        module: atom.module,
        atomClassName: atom.atomClassName,
        atomClassIdParent: atom.atomClassIdParent || 0,
      });
      const conditionExpression = node.options.conditionExpression;
      // get condition
      const startEventId = node.id;
      const _condition = await this.modelCondition.get({
        flowDefId, startEventId,
      });
      if (_condition) {
        // update
        _condition.atomClassId = atomClass.id;
        _condition.conditionExpression = conditionExpression;
        await this.modelCondition.update(_condition);
      } else {
        // insert
        await this.modelCondition.insert({
          flowDefId, startEventId,
          atomClassId: atomClass.id, conditionExpression,
        });
      }
    }

    async _match({ atom, userId }) {
      // order by atomStatic/conditionExpression
      const list = await ctx.model.query(`
          select a.* from aFlowNodeStartEventAtomCondition a
            left join aFlowDef b on a.flowDefId=b.id
            left join aAtom c on b.atomId=c.id
            where a.iid=? and a.atomClassId=?
            order by c.atomStatic asc, a.conditionExpression desc
        `, [ ctx.instance.id, atom.atomClassId ]);
      for (const _condition of list) {
        const flowInstance = await this._matchCondition({ _condition, atom, userId });
        if (flowInstance) return flowInstance;
      }
      return null;
    }

    async _matchCondition(context) {
      const { _condition, atom, userId } = context;
      // check if valid
      if (!(await this._checkConditionValid(context))) {
        await this._deleteCondition(context);
        return null;
      }
      // match conditionExpression
      const conditionActive = _condition.conditionExpression;
      if (conditionActive) {
        const res = ctx.bean.flow.evaluateExpression({
          expression: conditionActive,
          globals: { atom },
        });
        if (!res) return null;
      }
      // start
      const flowInstance = await ctx.bean.flow.startById({
        flowDefId: _condition.flowDefId,
        startEventId: _condition.startEventId,
        flowUserId: userId,
        flowAtomId: atom.atomId,
      });
      // ok
      return flowInstance;
    }

    async _checkConditionValid(context) {
      const { _condition } = context;
      // flowDef
      const flowDef = await ctx.bean.flowDef.getById({ flowDefId: _condition.flowDefId });
      if (!flowDef) return false;
      // atomDisabled
      if (flowDef.atomDisabled === 1) return false;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content) return false;
      const nodeConfig = content.process.nodes.find(item => item.id === _condition.startEventId);
      if (!nodeConfig) return false;
      // check if changed
      const conditionActive = _condition.conditionExpression;
      const conditionConfig = nodeConfig.options && nodeConfig.options.conditionExpression;
      if (conditionActive !== conditionConfig) return false;
      // ok
      return true;
    }

    async _deleteCondition(context) {
      const { _condition } = context;
      await this.modelCondition.delete({ id: _condition.id });
    }

  }

  return FlowNode;
};



/***/ }),

/***/ 288:
/***/ ((module) => {

module.exports = ctx => {

  class ContextTask {

    constructor({ context, contextNode, nodeDef }) {
      this.context = context;
      this.contextNode = contextNode;
      this._nodeDef = nodeDef;
      //
      this._flowTaskId = null;
      this._flowTask = null;
      this._flowTaskHistory = null;
      this._taskVars = null;
      //
      this._utils = null;
      //
      this._user = null;
    }

    get vars() {
      return this._taskVars;
    }

    get utils() {
      return this._utils;
    }

  }

  return ContextTask;
};


/***/ }),

/***/ 895:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const extend = require3('extend2');
const VarsFn = __webpack_require__(418);
const UtilsFn = __webpack_require__(294);

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    constructor({ nodeInstance }) {
      this.nodeInstance = nodeInstance;
      this.flowInstance = nodeInstance.flowInstance;
      this.context = nodeInstance.context;
      this.contextNode = nodeInstance.contextNode;
      // context
      this.contextTask = ctx.bean._newBean(`${moduleInfo.relativeName}.local.context.task`, {
        context: nodeInstance.context,
        contextNode: nodeInstance.contextNode,
        nodeDef: nodeInstance.contextNode._nodeDef,
      });
    }

    get modelFlowTask() {
      return ctx.model.module(moduleInfo.relativeName).flowTask;
    }
    get modelFlowTaskHistory() {
      return ctx.model.module(moduleInfo.relativeName).flowTaskHistory;
    }

    async init({ userIdAssignee, user }) {
      // create flowTask
      const flowTaskId = await this._createFlowTask({ userIdAssignee });
      // context init
      await this._contextInit({ flowTaskId, user });
      // event
      await this.created();
    }

    async _load({ flowTask, user, history }) {
      // context init
      await this._contextInit({ flowTaskId: flowTask.id, user, history });
    }

    async _createFlowTask({ userIdAssignee }) {
      // flowTask
      const data = {
        flowId: this.context._flowId,
        flowNodeId: this.contextNode._flowNodeId,
        flowTaskStatus: 0,
        userIdAssignee,
        specificFlag: 0,
        taskVars: '{}',
      };
      const res = await this.modelFlowTask.insert(data);
      const flowTaskId = res.insertId;
      // flowTaskHistory
      data.flowTaskId = flowTaskId;
      await this.modelFlowTaskHistory.insert(data);
      // notify
      this._notifyTaskClaimings(userIdAssignee);
      // ok
      return flowTaskId;
    }

    async _contextInit({ flowTaskId, user, history }) {
      // flowTaskId
      this.contextTask._flowTaskId = flowTaskId;
      // flowTask
      if (!history) {
        this.contextTask._flowTask = await this.modelFlowTask.get({ id: flowTaskId });
      }
      this.contextTask._flowTaskHistory = await this.modelFlowTaskHistory.get({ flowTaskId });
      // taskVars
      this.contextTask._taskVars = new (VarsFn())();
      this.contextTask._taskVars._vars = this.contextTask._flowTaskHistory.taskVars ? JSON.parse(this.contextTask._flowTaskHistory.taskVars) : {};
      // utils
      this.contextTask._utils = new (UtilsFn({ ctx, flowInstance: this.flowInstance }))({
        context: this.context,
        contextNode: this.contextNode,
        contextTask: this.contextTask,
      });
      // user
      this.contextTask._user = user;
    }

    async _hidden({ hidden }) {
      // flowTask
      const flowTaskHidden = hidden ? 1 : 0;
      this.contextTask._flowTask.flowTaskHidden = flowTaskHidden;
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // history
      this.contextTask._flowTaskHistory.flowTaskHidden = flowTaskHidden;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
    }

    async _claim() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // check: not throw error
      // if (flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1003, flowTaskId);
      if (flowTask.timeClaimed) {
        return { timeClaimed: flowTask.timeClaimed };
      }
      // flowTask
      const timeClaimed = new Date();
      this.contextTask._flowTask.timeClaimed = timeClaimed;
      this.contextTask._flowTask.flowTaskHidden = 0; // show
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // history
      this.contextTask._flowTaskHistory.timeClaimed = timeClaimed;
      this.contextTask._flowTaskHistory.flowTaskHidden = 0; // show
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // check if bidding
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      if (options.bidding) {
        // notify
        const _tasks = await ctx.model.query(`
          select id,userIdAssignee from aFlowTask
            where iid=? and flowNodeId=? and id<>?
          `, [ ctx.instance.id, flowTask.flowNodeId, flowTaskId ]);
        for (const _task of _tasks) {
          this._notifyTaskClaimings(_task.userIdAssignee);
        }
        // delete other tasks
        await ctx.model.query(`
          delete from aFlowTask
            where iid=? and flowNodeId=? and id<>?
          `, [ ctx.instance.id, flowTask.flowNodeId, flowTaskId ]);
        await ctx.model.query(`
          update aFlowTaskHistory set deleted=1
            where iid=? and deleted=0 and flowNodeId=? and flowTaskId<>?
          `, [ ctx.instance.id, flowTask.flowNodeId, flowTaskId ]);
      }
      // event: task.claimed
      await this.claimed();
      // notify
      this._notifyTaskClaimings(flowTask.userIdAssignee);
      this._notifyTaskHandlings(flowTask.userIdAssignee);
      // ok
      return { timeClaimed };
    }

    async _complete({ handle, formAtom }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // specificFlag must be 0
      if (flowTask.specificFlag !== 0) ctx.throw(403);
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // timeClaimed first
      if (!flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1004, flowTaskId);
      // check handled
      if (flowTask.flowTaskStatus !== 0) ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      // check if pass/reject
      if (handle) {
        const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
        if (handle.status === 1 && !options.allowPassTask) {
          ctx.throw.module(moduleInfo.relativeName, 1006, flowTaskId);
        }
        if (handle.status === 2 && !options.allowRejectTask) {
          ctx.throw.module(moduleInfo.relativeName, 1007, flowTaskId);
        }
      }
      // formAtom
      if (formAtom) {
        await this._complete_formAtom({ formAtom });
      }
      // handle
      if (handle) {
        await this._complete_handle({ handle });
        // event: task.completed
        await this.completed();
        // check if node done
        ctx.tail(async () => {
          await this._complete_tail({ flowTask, user });
        });
        // notify
        this._notifyTaskHandlings(flowTask.userIdAssignee);
      }
    }

    async _complete_tail({ flowTask, user }) {
      const flowNodeId = flowTask.flowNodeId;
      await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.flowTask.nodeDoneCheck.${flowNodeId}`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'flowTask',
            context: { flowNodeId, user },
            fn: '_nodeDoneCheckLock',
            transaction: true,
          });
        },
      });
    }

    async _assignees() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // specificFlag must be 1
      if (flowTask.specificFlag !== 1) ctx.throw(403);
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // timeClaimed first
      if (!flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1004, flowTaskId);
      // check handled
      if (flowTask.flowTaskStatus !== 0) ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      // handle
      return await this._assignees_handle();
    }

    async _assignees_handle() {
      // assignees
      const assignees = this.contextNode.vars.get('_assignees');
      // users
      let users;
      if (!assignees || assignees.length === 0) {
        users = [];
      } else {
        users = await ctx.bean.user.select({
          options: {
            where: {
              'a.disabled': 0,
              'a.id': assignees,
            },
            removePrivacy: true,
          },
        });
      }
      // options
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      // ok
      return {
        users,
        options: {
          confirmationAllowAppend: options.confirmationAllowAppend,
        },
      };
    }

    async _cancelFlow({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // specificFlag must be 0
      if (flowTask.specificFlag !== 0) ctx.throw(403);
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // check handled
      if (flowTask.flowTaskStatus !== 0) ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      // check if allowCancelFlow
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      if (!options.allowCancelFlow) {
        ctx.throw.module(moduleInfo.relativeName, 1010, flowTaskId);
      }
      // handle
      await this._cancelFlow_handle({ handle });
    }

    async _cancelFlow_handle({ handle }) {
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // close draft
      const atomId = this.context._flow.flowAtomId;
      if (atomId) {
        await ctx.bean.atom.closeDraft({ key: { atomId } });
      }
      // notify
      this._notifyTaskHandlings(flowTask.userIdAssignee);
      // delete flowTask
      await this.modelFlowTask.delete({ id: flowTaskId });
      // flowTaskHistory update
      this.contextTask._flowTaskHistory.flowTaskStatus = 1;
      this.contextTask._flowTaskHistory.timeHandled = new Date();
      this.contextTask._flowTaskHistory.handleStatus = 3;
      this.contextTask._flowTaskHistory.handleRemark = handle.remark;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // node clear
      //    not use handle.remark
      const remark = 'Cancelled';// handle.remark;
      await this.nodeInstance._clear({ flowNodeRemark: remark });
      // end flow
      await this.flowInstance._endFlow({ flowRemark: remark });
    }

    async _assigneesConfirmation({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // specificFlag must be 1
      if (flowTask.specificFlag !== 1) ctx.throw(403);
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // timeClaimed first
      if (!flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1004, flowTaskId);
      // check handled
      if (flowTask.flowTaskStatus !== 0) ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      // handle
      await this._assigneesConfirmation_handle({ handle });
      // notify
      this._notifyTaskHandlings(flowTask.userIdAssignee);
    }

    async _assigneesConfirmation_handle({ handle }) {
      // options
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      // flowTaskHistory update
      this.contextTask._flowTaskHistory.flowTaskStatus = 1;
      this.contextTask._flowTaskHistory.timeHandled = new Date();
      this.contextTask._flowTaskHistory.handleStatus = handle.status;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // delete flowTask and flowTaskHistory
      const flowTaskId = this.contextTask._flowTaskId;
      await this.modelFlowTask.delete({ id: flowTaskId });
      await this.modelFlowTaskHistory.delete({ flowTaskId });
      // passed
      if (handle.status === 1) {
        // assignees
        const assignees = await this.flowInstance._parseAssignees(handle.assignees);
        if (!assignees || assignees.length === 0) {
          ctx.throw.module(moduleInfo.relativeName, 1008, flowTaskId);
        }
        // check confirmationAllowAppend
        if (!options.confirmationAllowAppend) {
          const assigneesOld = this.contextNode.vars.get('_assignees');
          if (!(new Set(assigneesOld)).isSuperset(new Set(assignees))) {
            ctx.throw.module(moduleInfo.relativeName, 1009, flowTaskId);
          }
        }
        // save var: _assigneesConfirmation
        this.contextNode.vars.set('_assigneesConfirmation', assignees);
        // next stage of flow node: begin
        return await this.nodeInstance.begin();
      }
      // reject
      if (handle.status === 2) {
        return await ctx.bean.flowTask._gotoFlowNodePrevious({
          nodeInstance: this.nodeInstance, rejectedNode: null,
        });
      }
    }

    async _complete_formAtom({ formAtom }) {
      // schemaWrite
      const schemaWrite = await this._getSchemaWrite();
      if (!schemaWrite) return;
      // write
      const atomId = this.context._atom.atomId;
      const user = this.contextTask._user;
      await ctx.bean.atom.write({
        key: { atomId }, item: formAtom,
        options: { schema: schemaWrite },
        user,
      });
    }

    async _complete_handle({ handle }) {
      const timeHandled = new Date();
      // flowTask
      this.contextTask._flowTask.flowTaskStatus = 1;
      this.contextTask._flowTask.timeHandled = timeHandled;
      this.contextTask._flowTask.handleStatus = handle.status;
      this.contextTask._flowTask.handleRemark = handle.remark;
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // flowTaskHistory
      this.contextTask._flowTaskHistory.flowTaskStatus = 1;
      this.contextTask._flowTaskHistory.timeHandled = timeHandled;
      this.contextTask._flowTaskHistory.handleStatus = handle.status;
      this.contextTask._flowTaskHistory.handleRemark = handle.remark;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
    }

    async _actions() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // flowTaskStatus
      if (flowTask.flowTaskStatus === 1) return null;
      // actions
      const actions = [];
      // specificFlag
      if (flowTask.specificFlag === 1) {
        actions.push({
          name: 'assigneesConfirmation',
        });
      } else if (flowTask.specificFlag === 0) {
        // options
        const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
        // allowPassTask allowRejectTask
        if (options.allowPassTask || options.allowRejectTask) {
          actions.push({
            name: 'handleTask',
            options: {
              allowPassTask: options.allowPassTask,
              allowRejectTask: options.allowRejectTask,
            },
          });
        }
        // allowCancelFlow
        if (options.allowCancelFlow) {
          actions.push({
            name: 'cancelFlow',
          });
        }
      }
      // others
      return actions;
    }

    async _viewAtom() {
      return await this._getAtomAndSchema({ mode: 'read' });
    }

    async _editAtom() {
      return await this._getAtomAndSchema({ mode: 'write' });
    }

    async _getAtomAndSchema({ mode }) {
      // user/atom
      const user = this.contextTask._user;
      const atom = this.context._atom;
      // flowTask
      const flowTask = this.contextTask._flowTaskHistory;
      const flowTaskId = flowTask.flowTaskId;
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // must be the same flowId
      if (atom.atomFlowId !== this.context._flowId) ctx.throw.module('a-flow', 1009, this.context._flowId);
      // schema
      let schema = await this._getSchema({ mode });
      if (!schema) return null;
      // item
      const item = extend(true, {}, atom);
      // validate
      await ctx.bean.validation._validate({
        data: item,
        options: { schema },
      });
      // get real schema
      schema = ctx.bean.validation.getSchema(schema);
      // basic fields
      const fields = await ctx.bean.atom.modelAtom.columns();
      fields.atomId = {};
      fields.module = {};
      fields.atomClassName = {};
      fields.atomCategoryName = {};
      for (const field in fields) {
        item[field] = atom[field];
      }
      // ok
      return { schema, item };
    }

    async _getSchemaRead() {
      return await this._getSchema({ mode: 'read' });
    }

    async _getSchemaWrite() {
      return await this._getSchema({ mode: 'write' });
    }

    // mode: read/write
    async _getSchema({ mode }) {
      const module = this.context._atom.module;
      // options
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      const fields = options.schema && options.schema[mode];
      if (!fields) return null;
      // { module, validator, schema }
      if (fields && !Array.isArray(fields) && typeof fields === 'object') {
        return {
          module: fields.module,
          validator: fields.validator,
          schema: fields.schema,
        };
      }
      // base
      let schemaBase = await this._getSchemaBase();
      // full read/write
      if (fields === true && schemaBase) {
        return {
          module: schemaBase.module,
          validator: schemaBase.validator,
        };
      }
      if (!schemaBase) {
        schemaBase = {
          module,
          schema: { type: 'object', properties: {} },
        };
      }
      // some fields
      const propertiesBase = schemaBase.schema.properties;
      // properties
      const properties = {};
      for (const field of fields) {
        if (typeof field === 'string') {
          if (propertiesBase[field]) {
            properties[field] = propertiesBase[field];
          }
        } else {
          // { name, property }
          properties[field.name] = field.property;
        }
      }
      // schema
      let schema = {
        module,
        schema: { type: 'object', properties },
      };
      // listener
      const methodName = `getSchema${mode.replace(mode[0], mode[0].toUpperCase())}`;
      const res = await this.flowInstance._flowListener[methodName](this.contextTask, this.contextNode, { schemaBase, schema });
      if (res) {
        schema = res;
      }
      // ok
      return schema;
    }

    async _getSchemaBase() {
      const atomClassId = this.context._atom.atomClassId;
      const schema = await ctx.bean.atom.schema({
        atomClass: { id: atomClassId },
      });
      return schema;
    }

    async _saveTaskVars() {
      if (!this.contextTask._taskVars._dirty) return;
      // flowTask
      this.contextTask._flowTask.taskVars = JSON.stringify(this.contextTask._taskVars._vars);
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // flowTask history
      this.contextTask._flowTaskHistory.taskVars = this.contextTask._flowTask.taskVars;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // done
      this.contextTask._taskVars._dirty = false;
    }

    async _saveVars() {
      // save taskVars
      await this._saveTaskVars();
      // save nodeVars
      await this.nodeInstance._saveNodeVars();
      // save flowVars
      await this.flowInstance._saveFlowVars();
    }

    async created() {
      // raise event: onTaskCreated
      await this.flowInstance._flowListener.onTaskCreated(this.contextTask, this.contextNode);
      await this._saveVars();
    }

    async claimed() {
      // raise event: onTaskClaimed
      await this.flowInstance._flowListener.onTaskClaimed(this.contextTask, this.contextNode);
      await this._saveVars();
    }

    async completed() {
      // raise event: onTaskCompleted
      await this.flowInstance._flowListener.onTaskCompleted(this.contextTask, this.contextNode);
      await this._saveVars();
    }

    _notifyTaskClaimings(userId) {
      ctx.bean.flowTask._notifyTaskClaimings(userId);
    }

    _notifyTaskHandlings(userId) {
      ctx.bean.flowTask._notifyTaskHandlings(userId);
    }

  }
  return FlowTask;
};


/***/ }),

/***/ 716:
/***/ ((module) => {

module.exports = ctx => {
  class Procedure {

    selectTasks({ iid, userIdWho, where, orders, page, count, history }) {
      iid = parseInt(iid);
      userIdWho = parseInt(userIdWho);
      history = parseInt(history);

      // history
      if (history === 0) {
        return this._selectTasks_0({ iid, userIdWho, where, orders, page, count });
      }
      return this._selectTasks_1({ iid, userIdWho, where, orders, page, count });
    }

    _selectTasks_0({ iid, userIdWho, where, orders, page, count }) {
      // -- tables
      // -- a: aFlowTask
      // -- b: aFlowNode
      // -- c: aFlow
      // -- d: aUser

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
        _userWhere = ` and a.userIdAssignee=${userIdWho}`;
      } else {
        _userWhere = '';
      }

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = `a.*,a.id as flowTaskId,
            b.flowNodeDefId,b.flowNodeName,b.flowNodeType,
            c.flowDefId,c.flowDefKey,c.flowDefRevision,c.flowName,c.flowStatus,c.flowAtomId,c.flowNodeIdCurrent,c.flowUserId,
            d.userName,d.avatar
          `;
      }

      // sql
      const _sql =
        `select ${_selectFields} from aFlowTask a
            inner join aFlowNode b on a.flowNodeId=b.id
            inner join aFlow c on a.flowId=c.id
            left join aUser d on a.userIdAssignee=d.id

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

    _selectTasks_1({ iid, userIdWho, where, orders, page, count }) {
      // -- tables
      // -- a: aFlowTaskHistory
      // -- b: aFlowNodeHistory
      // -- c: aFlowHistory
      // -- d: aUser

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
        _userWhere = ` and a.userIdAssignee=${userIdWho}`;
      } else {
        _userWhere = '';
      }

      // fields
      let _selectFields;
      if (count) {
        _selectFields = 'count(*) as _count';
      } else {
        _selectFields = `a.*,
            b.flowNodeDefId,b.flowNodeName,b.flowNodeType,b.flowNodeStatus,b.flowNodeRemark,b.timeDone,
            c.flowDefId,c.flowDefKey,c.flowDefRevision,c.flowName,c.flowStatus,c.flowAtomId,c.flowNodeIdCurrent,c.flowUserId,
            d.userName,d.avatar
          `;
      }

      // sql
      const _sql =
        `select ${_selectFields} from aFlowTaskHistory a
            inner join aFlowNodeHistory b on a.flowNodeId=b.flowNodeId
            inner join aFlowHistory c on a.flowId=c.flowId
            left join aUser d on a.userIdAssignee=d.id

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

/***/ 951:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {

    async execute(context) {
      const { user } = context;
      const modelFlowTask = ctx.model.module(moduleInfo).flowTask;
      const count = await modelFlowTask.count({
        userIdAssignee: user.id,
        flowTaskStatus: 0,
        timeClaimed: null,
      });
      return count;
    }

  }

  return Stats;
};


/***/ }),

/***/ 843:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {

    async execute(context) {
      const { user } = context;
      const modelFlowTask = ctx.model.module(moduleInfo).flowTask;
      const count = await modelFlowTask.count({
        userIdAssignee: user.id,
        flowTaskStatus: 0,
        timeClaimed: { op: 'notNull' },
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

        // create table: aFlowNodeStartEventAtomCondition
        sql = `
          CREATE TABLE aFlowNodeStartEventAtomCondition (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowDefId int(11) DEFAULT '0',
            startEventId varchar(255) DEFAULT NULL,
            atomClassId int(11) DEFAULT '0',
            conditionExpression TEXT DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aFlowTask
        sql = `
          CREATE TABLE aFlowTask (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowId int(11) DEFAULT '0',
            flowNodeId int(11) DEFAULT '0',
            flowTaskStatus int(11) DEFAULT '0',
            flowTaskHidden int(11) DEFAULT '0',
            userIdAssignee int(11) DEFAULT '0',
            specificFlag int(11) DEFAULT '0',
            handleStatus int(11) DEFAULT '0',
            handleRemark TEXT DEFAULT NULL,
            timeClaimed timestamp DEFAULT NULL,
            timeHandled timestamp DEFAULT NULL,
            taskVars JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

        // create table: aFlowTaskHistory
        sql = `
          CREATE TABLE aFlowTaskHistory (
            id int(11) NOT NULL AUTO_INCREMENT,
            createdAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted int(11) DEFAULT '0',
            iid int(11) DEFAULT '0',
            flowId int(11) DEFAULT '0',
            flowTaskId int(11) DEFAULT '0',
            flowNodeId int(11) DEFAULT '0',
            flowTaskStatus int(11) DEFAULT '0',
            flowTaskHidden int(11) DEFAULT '0',
            userIdAssignee int(11) DEFAULT '0',
            specificFlag int(11) DEFAULT '0',
            handleStatus int(11) DEFAULT '0',
            handleRemark TEXT DEFAULT NULL,
            timeClaimed timestamp DEFAULT NULL,
            timeHandled timestamp DEFAULT NULL,
            taskVars JSON DEFAULT NULL,
            PRIMARY KEY (id)
          )
        `;
        await this.ctx.model.query(sql);

      }
    }

    async init(options) {
    }

    async test() {
    }

  }

  return Version;
};


/***/ }),

/***/ 187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(899);
const flowNodeStartEventAtom = __webpack_require__(252);
const flowNodeActivityUserTask = __webpack_require__(892);
const localContextTask = __webpack_require__(288);
const localFlowTask = __webpack_require__(895);
const localProcedure = __webpack_require__(716);
const beanFlowTask = __webpack_require__(302);
const statsTaskClaimings = __webpack_require__(951);
const statsTaskHandlings = __webpack_require__(843);

module.exports = app => {
  const beans = {
    // version
    'version.manager': {
      mode: 'app',
      bean: versionManager,
    },
    // flow
    'flow.node.startEventAtom': {
      mode: 'ctx',
      bean: flowNodeStartEventAtom,
    },
    'flow.node.activityUserTask': {
      mode: 'ctx',
      bean: flowNodeActivityUserTask,
    },
    // local
    'local.context.task': {
      mode: 'ctx',
      bean: localContextTask,
    },
    'local.flow.task': {
      mode: 'ctx',
      bean: localFlowTask,
    },
    'local.procedure': {
      mode: 'ctx',
      bean: localProcedure,
    },
    // global
    flowTask: {
      mode: 'ctx',
      bean: beanFlowTask,
      global: true,
    },
    // stats
    'stats.taskClaimings': {
      mode: 'ctx',
      bean: statsTaskClaimings,
    },
    'stats.taskHandlings': {
      mode: 'ctx',
      bean: statsTaskHandlings,
    },
  };
  return beans;
};


/***/ }),

/***/ 271:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(718);
const assert = require3('assert');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNodeActivityUserTaskBase extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeEnter() {
      // super
      await super.onNodeEnter();

      // options
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({
        nodeInstance: this.nodeInstance,
      });

      // prepare assignees
      const res = await this._prepareAssignees({ options });
      if (!res) return false;

      // ok
      return true;
    }

    async onNodeBegin() {
      // super
      await super.onNodeBegin();

      // options
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({
        nodeInstance: this.nodeInstance,
      });

      // user
      const user = this.flowInstance._getOpUser();

      // var: _assigneesConfirmation
      const assignees = this.contextNode.vars.get('_assigneesConfirmation');
      assert(assignees && assignees.length > 0);

      // create tasks
      for (const userIdAssignee of assignees) {
        const taskInstance = await ctx.bean.flowTask._createTaskInstance({
          nodeInstance: this.nodeInstance,
          userIdAssignee,
          user,
        });
        if (!options.showAssignees) {
          await taskInstance._hidden({ hidden: true });
        }
      }

      // ok
      return true;
    }

    async onNodeDoing() {
      // super
      await super.onNodeDoing();

      // break
      return false;
    }

    async clearRemains() {
      await ctx.bean.flowTask._clearRemains({ nodeInstance: this.nodeInstance });
    }

    async _prepareAssignees({ options }) {
      // check var: _assigneesConfirmation
      let assignees = this.contextNode.vars.get('_assigneesConfirmation');
      if (assignees && assignees.length > 0) return true;

      // check var: _assignees
      this.contextNode.vars.get('_assignees');
      if (!assignees || assignees.length === 0) {
        // assignees
        assignees = await this.flowInstance._parseAssignees(options.assignees);
      }

      // confirmation
      if (assignees.length === 0 || options.confirmation) {
        // save var: _assignees
        this.contextNode.vars.set('_assignees', assignees);
        // user
        const user = this.flowInstance._getOpUser();
        const taskInstance = await ctx.bean.flowTask._createTaskInstance({
          nodeInstance: this.nodeInstance,
          userIdAssignee: user.id,
          user,
        });
        await this._taskConfirmationClaim({ taskInstance });
        // break
        return false;
      }

      // save var: _assigneesConfirmation
      this.contextNode.vars.set('_assigneesConfirmation', assignees);

      // ok
      return true;
    }

    async _taskConfirmationClaim({ taskInstance }) {
      // specificFlag timeClaimed
      const specificFlag = 1;
      const timeClaimed = new Date();
      taskInstance.contextTask._flowTask.specificFlag = specificFlag;
      taskInstance.contextTask._flowTask.timeClaimed = timeClaimed;
      await taskInstance.modelFlowTask.update(taskInstance.contextTask._flowTask);
      // history
      taskInstance.contextTask._flowTaskHistory.specificFlag = specificFlag;
      taskInstance.contextTask._flowTaskHistory.timeClaimed = timeClaimed;
      await taskInstance.modelFlowTaskHistory.update(taskInstance.contextTask._flowTaskHistory);
      // notify
      taskInstance._notifyTaskClaimings(taskInstance.contextTask._flowTask.userIdAssignee);
      taskInstance._notifyTaskHandlings(taskInstance.contextTask._flowTask.userIdAssignee);
    }

  }
  return FlowNodeActivityUserTaskBase;
};


/***/ }),

/***/ 294:
/***/ ((module) => {

module.exports = ({ ctx /* flowInstance*/ }) => {
  class Utils {

    constructor({ context, contextNode, contextTask }) {
      this.context = context;
      this.contextNode = contextNode;
      this.contextTask = contextTask;
    }

    async executeService({ bean, parameter }) {
      const globals = {};
      if (this.context) globals.context = this.context;
      if (this.contextNode) globals.contextNode = this.contextNode;
      if (this.contextTask) globals.contextTask = this.contextTask;
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
  return config;
};


/***/ }),

/***/ 624:
/***/ ((module) => {

// error code should start from 1001
module.exports = {
  1001: 'Task not Found: %s',
  1002: 'Task cannot be accessed: %s',
  1003: 'Task has been claimed: %s',
  1004: 'Task should be claimed first: %s',
  1005: 'Task has been handled: %s',
  1006: 'Task cannot be passed: %s',
  1007: 'Task cannot be rejected: %s',
  1008: 'Task Assignees cannot be empty: %s',
  1009: 'Task Assignees cannot be appended: %s',
  1010: 'Flow cannot be cancelled: %s',
};


/***/ }),

/***/ 614:
/***/ ((module) => {

module.exports = {
  startEventAtom: {
    atom: null,
    conditionExpression: null,
    task: {
      assignees: {
        users: null,
        roles: null,
        vars: 'flowUser',
      },
      showAssignees: false,
      confirmation: false,
      confirmationAllowAppend: false,
      bidding: false,
      completionCondition: {
        passed: 1,
        rejected: '100%',
      },
      rejectedNode: null,
      allowPassTask: true,
      allowRejectTask: false,
      allowCancelFlow: true,
      schema: {
        read: true,
        write: true,
      },
    },
  },
  activityUserTask: {
    assignees: {
      users: null,
      roles: null,
      vars: null,
    },
    showAssignees: false,
    confirmation: false,
    confirmationAllowAppend: false,
    bidding: false,
    completionCondition: {
      passed: 1,
      rejected: '100%',
    },
    rejectedNode: null,
    allowPassTask: true,
    allowRejectTask: true,
    allowCancelFlow: false,
    schema: {
      read: true,
      write: false,
    },
  },
};


/***/ }),

/***/ 587:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const defaults = __webpack_require__(614);

const nodes = {
  // events
  startEventAtom: {
    title: 'StartEventAtom',
    group: 'startEvent',
    bean: 'startEventAtom',
    icon: '/api/static/a/flowtask/bpmn/events/start-event-atom.svg',
  },
  // activities
  activityUserTask: {
    title: 'ActivityUserTask',
    group: 'activity',
    bean: 'activityUserTask',
    icon: '/api/static/a/flowtask/bpmn/activities/activity-user-task.svg',
  },
};

for (const key in nodes) {
  const node = nodes[key];
  node.options = {};
  if (defaults[key]) {
    node.options.default = defaults[key];
  }
}

module.exports = nodes;


/***/ }),

/***/ 327:
/***/ ((module) => {

module.exports = {
  StartEventAtom: 'StartEvent: Atom Draft',
  ActivityUserTask: 'Activity: User Task',
};


/***/ }),

/***/ 72:
/***/ ((module) => {

module.exports = {
  StartEventAtom: '原子起草开始事件',
  ActivityUserTask: '用户任务活动',
  'Task not Found: %s': '任务未发现: %s',
  'Task cannot be accessed: %s': '任务无权访问: %s',
  'Task has been claimed: %s': '任务已被申领: %s',
  'Task should be claimed first: %s': '任务必须先申领: %s',
  'Task has been handled: %s': '任务已处理: %s',
  'Task cannot be passed: %s': '任务无权被通过: %s',
  'Task cannot be rejected: %s': '任务无权被拒绝: %s',
  'Task Assignees cannot be empty: %s': '任务参与人不允许为空: %s',
  'Task Assignees cannot be appended: %s': '任务参与人不允许追加: %s',
  'Flow cannot be cancelled: %s': '流程无权被取消: %s',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(327),
  'zh-cn': __webpack_require__(72),
};


/***/ }),

/***/ 623:
/***/ ((module) => {

module.exports = app => {

  class FlowController extends app.Controller {

    async data() {
      const res = await this.ctx.service.flow.data({
        flowId: this.ctx.request.body.flowId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return FlowController;
};


/***/ }),

/***/ 174:
/***/ ((module) => {

module.exports = app => {

  class FlowTaskController extends app.Controller {

    // options
    //   where, orders, page, history
    async select() {
      const options = this.ctx.request.body.options;
      options.page = this.ctx.bean.util.page(options.page);
      const items = await this.ctx.service.flowTask.select({
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.successMore(items, options.page.index, options.page.size);
    }

    async count() {
      const options = this.ctx.request.body.options;
      const count = await this.ctx.service.flowTask.count({
        options,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(count);
    }

    async claim() {
      const res = await this.ctx.service.flowTask.claim({
        flowTaskId: this.ctx.request.body.flowTaskId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async complete() {
      const res = await this.ctx.service.flowTask.complete({
        flowTaskId: this.ctx.request.body.flowTaskId,
        handle: this.ctx.request.body.handle,
        formAtom: this.ctx.request.body.formAtom,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async assignees() {
      const res = await this.ctx.service.flowTask.assignees({
        flowTaskId: this.ctx.request.body.flowTaskId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async assigneesConfirmation() {
      const res = await this.ctx.service.flowTask.assigneesConfirmation({
        flowTaskId: this.ctx.request.body.flowTaskId,
        handle: this.ctx.request.body.handle,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async cancelFlow() {
      const res = await this.ctx.service.flowTask.cancelFlow({
        flowTaskId: this.ctx.request.body.flowTaskId,
        handle: this.ctx.request.body.handle,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async actions() {
      const res = await this.ctx.service.flowTask.actions({
        flowTaskId: this.ctx.request.body.flowTaskId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async viewAtom() {
      const res = await this.ctx.service.flowTask.viewAtom({
        flowTaskId: this.ctx.request.body.flowTaskId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async editAtom() {
      const res = await this.ctx.service.flowTask.editAtom({
        flowTaskId: this.ctx.request.body.flowTaskId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

  }
  return FlowTaskController;
};



/***/ }),

/***/ 95:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flow = __webpack_require__(623);
const flowTask = __webpack_require__(174);

module.exports = app => {
  const controllers = {
    flow,
    flowTask,
  };
  return controllers;
};


/***/ }),

/***/ 421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(76);
const locales = __webpack_require__(25);
const errors = __webpack_require__(624);

module.exports = app => {

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
    meta,
  };

};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flowNodes = __webpack_require__(587);

module.exports = app => {
  // const schemas = require('./config/validation/schemas.js')(app);
  const meta = {
    base: {
      atoms: {
      },
    },
    validation: {
      validators: {
      },
      keywords: {},
      schemas: {
      },
    },
    flow: {
      nodes: flowNodes,
    },
    stats: {
      providers: {
        taskClaimings: {
          user: true,
          bean: 'taskClaimings',
        },
        taskHandlings: {
          user: true,
          bean: 'taskHandlings',
        },
        taskClaimingsHandlings: {
          user: true,
          bean: {
            module: 'a-stats',
            name: 'deps',
          },
          dependencies: [
            'a-flowtask:taskClaimings',
            'a-flowtask:taskHandlings',
          ],
        },
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 514:
/***/ ((module) => {

module.exports = app => {
  class FlowNodeStartEventAtomCondition extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowNodeStartEventAtomCondition', options: { disableDeleted: true } });
    }
  }
  return FlowNodeStartEventAtomCondition;
};


/***/ }),

/***/ 688:
/***/ ((module) => {

module.exports = app => {
  class FlowTask extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowTask', options: { disableDeleted: true } });
    }
  }
  return FlowTask;
};


/***/ }),

/***/ 761:
/***/ ((module) => {

module.exports = app => {
  class FlowTaskHistory extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aFlowTaskHistory', options: { disableDeleted: false } });
    }
  }
  return FlowTaskHistory;
};


/***/ }),

/***/ 230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flowNodeStartEventAtomCondition = __webpack_require__(514);
const flowTask = __webpack_require__(688);
const flowTaskHistory = __webpack_require__(761);

module.exports = app => {
  const models = {
    flowNodeStartEventAtomCondition,
    flowTask,
    flowTaskHistory,
  };
  return models;
};


/***/ }),

/***/ 825:
/***/ ((module) => {

module.exports = app => {
  const routes = [
    // flow
    { method: 'post', path: 'flow/data', controller: 'flow' },
    // task
    { method: 'post', path: 'task/select', controller: 'flowTask' },
    { method: 'post', path: 'task/count', controller: 'flowTask' },
    { method: 'post', path: 'task/claim', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/complete', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/assignees', controller: 'flowTask' },
    { method: 'post', path: 'task/assigneesConfirmation', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/cancelFlow', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/actions', controller: 'flowTask' },
    { method: 'post', path: 'task/viewAtom', controller: 'flowTask' },
    { method: 'post', path: 'task/editAtom', controller: 'flowTask' },
  ];
  return routes;
};


/***/ }),

/***/ 934:
/***/ ((module) => {

module.exports = app => {

  class Flow extends app.Service {

    async data({ flowId, user }) {
      // flow
      const flow = await this._data_flow({ flowId, user });
      // atom
      const atom = await this._data_atom({ flowId, atomId: flow.flowAtomId });
      // tasks
      const tasks = await this._data_tasks({ flowId, user });
      // ok
      return { flow, atom, tasks };
    }

    async _data_flow({ flowId, user }) {
      // select flow
      const flow = await this.ctx.bean.flow.get({ flowId, history: true, user });
      if (!flow) this.ctx.throw(404);
      // ok
      return flow;
    }

    async _data_atom({ flowId, atomId }) {
      // only read basic info
      //   a.atomFlowId = {flowId}
      const atom = await this.ctx.model.queryOne(`
        select a.*,a.id as atomId,b.module,b.atomClassName from aAtom a
           left join aAtomClass b on a.atomClassId=b.id
             where a.deleted=0 and a.iid=? and a.id=?
                   and a.atomFlowId=?
        `, [ this.ctx.instance.id, atomId, flowId ]);
      return atom;
    }

    async _data_tasks({ flowId, user }) {
      // select tasks
      const tasks = await this.ctx.bean.flowTask.select({
        options: {
          where: {
            'a.flowId': flowId,
            'b.flowNodeType': [ 'startEventAtom', 'activityUserTask' ],
            __or__: [
              { 'a.userIdAssignee': user.id },
              { 'a.flowTaskHidden': 0 },
            ],
          },
          orders: [
            [ 'a.flowNodeId', 'desc' ],
            [ 'a.flowTaskStatus', 'asc' ],
          ],
          history: 1,
        },
        user: null,
        pageForce: false,
      });
      // loop
      for (const task of tasks) {
        // actions
        if (task.userIdAssignee === user.id && task.flowTaskStatus === 0) {
          task._actions = await this.ctx.bean.flowTask.actions({ flowTaskId: task.flowTaskId, user });
        }
      }
      return tasks;
    }

  }
  return Flow;
};



/***/ }),

/***/ 199:
/***/ ((module) => {

module.exports = app => {

  class FlowTask extends app.Service {

    async select({ options, user }) {
      return await this.ctx.bean.flowTask.select({ options, user });
    }

    async count({ options, user }) {
      return await this.ctx.bean.flowTask.count({ options, user });
    }

    async claim({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.claim({ flowTaskId, user });
    }

    async complete({ flowTaskId, handle, formAtom, user }) {
      return await this.ctx.bean.flowTask.complete({ flowTaskId, handle, formAtom, user });
    }

    async assignees({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.assignees({ flowTaskId, user });
    }

    async assigneesConfirmation({ flowTaskId, handle, user }) {
      return await this.ctx.bean.flowTask.assigneesConfirmation({ flowTaskId, handle, user });
    }

    async cancelFlow({ flowTaskId, handle, user }) {
      return await this.ctx.bean.flowTask.cancelFlow({ flowTaskId, handle, user });
    }

    async actions({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.actions({ flowTaskId, user });
    }

    async viewAtom({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.viewAtom({ flowTaskId, user });
    }

    async editAtom({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.editAtom({ flowTaskId, user });
    }

  }
  return FlowTask;
};



/***/ }),

/***/ 214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flow = __webpack_require__(934);
const flowTask = __webpack_require__(199);

module.exports = app => {
  const services = {
    flow,
    flowTask,
  };
  return services;
};


/***/ }),

/***/ 718:
/***/ ((module) => {

"use strict";
module.exports = require("require3");;

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