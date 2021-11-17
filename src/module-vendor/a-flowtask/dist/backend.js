/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 5224:
/***/ ((module) => {

module.exports = app => {
  const aops = {};
  return aops;
};


/***/ }),

/***/ 2302:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flowTask_0 = __webpack_require__(9645);
const flowTask_1 = __webpack_require__(9303);
const flowTask_2 = __webpack_require__(267);

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(flowTask_0, [flowTask_1, flowTask_2], ctx);
};


/***/ }),

/***/ 9645:
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
    get localRight() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.right');
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

    async appendHandleRemark({ flowTaskId, handle, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user, history: true });
      await taskInstance._appendHandleRemark({ handle });
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

    async recall({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._recall();
    }

    async cancelFlow({ flowTaskId, handle, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._cancelFlow({ handle });
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

    async forward({ flowTaskId, handle, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._forward({ handle });
    }

    async forwardRecall({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._forwardRecall();
    }

    async substitute({ flowTaskId, handle, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._substitute({ handle });
    }

    async substituteRecall({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._substituteRecall();
    }

    async flowData({ flowId, user }) {
      // flow
      const flow = await this._flowData_flow({ flowId, user });
      if (!flow) return null;
      // atom
      const atom = await this._flowData_atom({ flowId, atomId: flow.flowAtomId });
      // tasks
      const tasks = await this._flowData_tasks({ flow, atom, flowId, user });
      // ok
      return { flow, atom, tasks };
    }
  }

  return FlowTask;
};


/***/ }),

/***/ 9303:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _nodeDoneCheckLock({ flowNodeId }) {
      // load flow node
      let nodeInstance;
      try {
        nodeInstance = await ctx.bean.flow._loadFlowNodeInstance({ flowNodeId });
      } catch (err) {}
      if (!nodeInstance) {
        // here means done
        return;
      }
      // options
      const options = this._getNodeDefOptionsTask({ nodeInstance });
      // completionCondition
      const completionCondition = options.completionCondition;
      // task count
      const taskCountTotal = await this.modelFlowTask.count({
        flowNodeId,
        ignoreMark: 0,
      });
      if (taskCountTotal === 0) {
        // means node has been checked and done
        // XX //   should throw error to deny the db changed for tasks has been deleted.
        // XX ctx.throw.module('a-flow', 1004, flowNodeId);
        // neednot throw error for this method is called in ctx.tail
        return;
      }
      const taskCountPassed = await this.modelFlowTask.count({
        flowNodeId,
        flowTaskStatus: 1,
        handleStatus: 1,
        ignoreMark: 0,
      });
      const taskCountRejected = await this.modelFlowTask.count({
        flowNodeId,
        flowTaskStatus: 1,
        handleStatus: 2,
        ignoreMark: 0,
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
      // next stage of flow node: end
      return await nodeInstance.end();
    }

    async _nodeDoneCheckLock_rejected({ nodeInstance, options }) {
      // rejectedNode
      return await this._gotoFlowNodePrevious({ nodeInstance, rejectedNode: options.rejectedNode });
    }

    async _gotoFlowNodePrevious({ nodeInstance, rejectedNode, flowNodeRemark = 'Rejected' }) {
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
      // clear & enter
      await nodeInstance.clear({ flowNodeHandleStatus: 2, flowNodeRemark });
      return await nodeInstancePrev.enter();
    }

    async _findFlowNodeHistoryPrevious({ nodeInstance }) {
      // flowNodeId
      const flowNodeId = nodeInstance.contextNode._flowNodeId;
      return await nodeInstance.flowInstance._findFlowNodeHistoryPrevious({
        flowNodeId,
        cb: ({ /* flowNode*/ nodeDef }) => {
          return nodeDef.type.indexOf('startEventAtom') > -1 || nodeDef.type.indexOf('activityUserTask') > -1;
        },
      });
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
        where,
        orders,
        page,
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
      return nodeDef.type.indexOf('startEventAtom') > -1 ? options.task : options;
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
      // flowTaskHistory
      //   1. delete specificFlag=2
      await ctx.model.query(
        `
        update aFlowTaskHistory set deleted=1
          where iid=? and deleted=0 and flowNodeId=? and flowTaskStatus=0 and specificFlag=2 
        `,
        [ctx.instance.id, flowNodeId]
      );
      //   2. close
      //    flowTaskStatus:1
      //    handleStatus: not changed
      await ctx.model.query(
        `
        update aFlowTaskHistory set flowTaskStatus=1
          where iid=? and deleted=0 and flowNodeId=? and flowTaskStatus=0
        `,
        [ctx.instance.id, flowNodeId]
      );
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

/***/ 267:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _flowData_flow({ flowId, user }) {
      // select flow
      const flow = await ctx.bean.flow.get({ flowId, history: true, user });
      // not throw error
      // if (!flow) ctx.throw(404);
      // ok
      return flow;
    }

    async _flowData_atom({ flowId, atomId }) {
      // only read basic info
      //   a.atomFlowId = {flowId}
      const atom = await ctx.model.queryOne(
        `
        select a.*,a.id as atomId,b.module,b.atomClassName from aAtom a
           left join aAtomClass b on a.atomClassId=b.id
             where a.deleted=0 and a.iid=? and a.id=?
                   and a.atomFlowId=?
        `,
        [ctx.instance.id, atomId, flowId]
      );
      return atom;
    }

    async _flowData_tasks({ flow, atom, flowId, user }) {
      // select tasks
      let tasks = await ctx.bean.flowTask.select({
        options: {
          where: {
            'a.flowId': flowId,
            'b.flowNodeType': [
              'a-flowtask:startEventAtom',
              'a-flowtask:activityUserTask',
              'startEventAtom',
              'activityUserTask',
            ],
            __or__: [{ 'a.userIdAssignee': user.id }, { 'a.flowTaskHidden': 0 }],
          },
          orders: [
            ['a.flowNodeId', 'desc'],
            // ['a.specificFlag', 'desc'], // need not
            ['a.flowTaskStatus', 'asc'],
            ['a.createdAt', 'desc'],
          ],
          history: 1,
        },
        user: null,
        pageForce: false,
      });
      // flowOld
      const flowOld = !atom || atom.atomFlowId !== flow.flowId;
      // nodeInstances
      const nodeInstances = {
        _nodeInstances: {},
        _options: {},
        async get(flowNodeId) {
          let nodeInstance = this._nodeInstances[flowNodeId];
          if (!nodeInstance) {
            nodeInstance = await ctx.bean.flow._loadFlowNodeInstance({ flowNodeId });
            this._nodeInstances[flowNodeId] = nodeInstance;
          }
          return nodeInstance;
        },
        async getOptions(flowNodeId) {
          let options = this._options[flowNodeId];
          if (!options) {
            const nodeInstance = await this.get(flowNodeId);
            options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance });
            this._options[flowNodeId] = options;
          }
          return options;
        },
      };
      // map
      tasks = tasks.map(task => {
        if (task.flowTaskIdSubstituteTo) {
          const taskTo = tasks.find(item => item.flowTaskId === task.flowTaskIdSubstituteTo);
          if (user.id !== task.userIdAssignee && user.id !== taskTo.userIdAssignee) {
            taskTo.__remove = true;
            return {
              ...task,
              timeHandled: taskTo.timeHandled,
              handleStatus: taskTo.handleStatus,
              handleRemark: taskTo.handleRemark,
              handleRemarkLocale: taskTo.handleRemarkLocale,
              flowTaskIdSubstituteTo: 0,
              ignoreMark: 0,
            };
          }
        }
        return task;
      });
      // filter
      tasks = tasks.filter(task => {
        if (task.__remove) return false;
        if ((task.specificFlag === 1 || task.specificFlag === 2) && task.userIdAssignee !== user.id) return false;
        return true;
      });
      // loop
      for (const task of tasks) {
        // actions
        if (task.userIdAssignee === user.id && !flowOld) {
          task._actions = await this._flowData_task_actions({ nodeInstances, tasks, task, user });
        }
      }
      return tasks;
    }

    async _flowData_task_checkRight(fn) {
      try {
        await fn;
        return true;
      } catch (err) {
        return false;
      }
    }

    async _flowData_task_actions({ nodeInstances, tasks, task, user }) {
      // info
      const isDone = task.flowTaskStatus === 1;
      // actions
      const actions = [];
      const flowTask = task;
      let res;
      // 1. assigneesConfirmation
      res = await this._flowData_task_checkRight(this.localRight.assigneesConfirmation({ flowTask, user }));
      if (res) {
        actions.push({
          name: 'assigneesConfirmation',
        });
        // only one action
        return actions;
      }
      // 2. recall
      res = await this._flowData_task_checkRight(this.localRight.recall({ flowTask, user }));
      if (res) {
        actions.push({
          name: 'recall',
        });
        // only one action
        return actions;
      }
      // 3. claim
      if (!isDone && !task.timeClaimed) {
        const options = await nodeInstances.getOptions(task.flowNodeId);
        actions.push({
          name: 'claim',
          options: {
            bidding: options.bidding,
          },
        });
      }
      // 3. handleTask
      res = await this._flowData_task_checkRight(
        this.localRight.complete({
          flowTask,
          user,
          handle: null,
          getOptions: async () => {
            return await nodeInstances.getOptions(task.flowNodeId);
          },
          disableCheckTimeClaimed: true,
        })
      );
      if (res) {
        const options = await nodeInstances.getOptions(task.flowNodeId);
        actions.push({
          name: 'handleTask',
          options: {
            allowPassTask: options.allowPassTask,
            allowRejectTask: options.allowRejectTask,
          },
        });
      }
      // 4. cancelFlow
      res = await this._flowData_task_checkRight(
        this.localRight.cancelFlow({
          flowTask,
          user,
          getOptions: async () => {
            return await nodeInstances.getOptions(task.flowNodeId);
          },
          disableCheckTimeClaimed: true,
        })
      );
      if (res) {
        actions.push({
          name: 'cancelFlow',
        });
      }
      // 5. viewAtom
      actions.push({
        name: 'viewAtom',
      });
      // 6. appendHandleRemark
      res = await this._flowData_task_checkRight(
        this.localRight.appendHandleRemark({ flowTask, user, flowNodeType: task.flowNodeType })
      );
      if (res) {
        actions.push({
          name: 'appendHandleRemark',
        });
      }
      // 7.1 allowForward: forward
      res = await this._flowData_task_checkRight(
        this.localRight.forward({
          flowTask,
          user,
          getOptions: async () => {
            return await nodeInstances.getOptions(task.flowNodeId);
          },
          disableCheckTimeClaimed: true,
        })
      );
      if (res) {
        actions.push({
          name: 'forward',
        });
      }
      // 7.2 allowForward: forwardRecall
      res = await this._flowData_task_checkRight(
        this.localRight.forwardRecall({
          flowTask,
          user,
          getOptions: async () => {
            return await nodeInstances.getOptions(task.flowNodeId);
          },
          getTask: flowTaskIdForwardTo => {
            return tasks.find(item => item.flowTaskId === flowTaskIdForwardTo);
          },
        })
      );
      if (res) {
        actions.push({
          name: 'forwardRecall',
        });
      }
      // 8.1 allowSubstitute: substitute
      res = await this._flowData_task_checkRight(
        this.localRight.substitute({
          flowTask,
          user,
          getOptions: async () => {
            return await nodeInstances.getOptions(task.flowNodeId);
          },
          disableCheckTimeClaimed: true,
        })
      );
      if (res) {
        actions.push({
          name: 'substitute',
        });
      }
      // 8.2 allowSubstitute: substituteRecall
      res = await this._flowData_task_checkRight(
        this.localRight.substituteRecall({
          flowTask,
          user,
          getOptions: async () => {
            return await nodeInstances.getOptions(task.flowNodeId);
          },
          getTask: flowTaskIdSubstituteTo => {
            return tasks.find(item => item.flowTaskId === flowTaskIdSubstituteTo);
          },
        })
      );
      if (res) {
        actions.push({
          name: 'substituteRecall',
        });
      }
      // ok
      return actions;
    }
  }
  return FlowTask;
};


/***/ }),

/***/ 4892:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const FlowNodeActivityUserTaskBase = __webpack_require__(3271);

module.exports = ctx => {
  class FlowNode extends FlowNodeActivityUserTaskBase(ctx) {}

  return FlowNode;
};


/***/ }),

/***/ 5895:
/***/ ((module) => {

module.exports = ctx => {
  class FlowNode extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeLeave() {
      await super.onNodeLeave();
      // end
      await this.flowInstance._endFlow({
        flowHandleStatus: 1,
        flowRemark: 'End',
        atom: {
          submit: true,
        },
      });
      // also true
      return true;
    }
  }

  return FlowNode;
};


/***/ }),

/***/ 2252:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const FlowNodeActivityUserTaskBase = __webpack_require__(3271);

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
        await this._deleteCondition2({ flowDefId, node });
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
        },
      });
      const task = tasks[0];
      const flowTaskId = task.id;
      const user = { id: task.userIdAssignee };
      // complete automatically only on first-in
      if (this.contextNode._flowNode.flowNodeIdPrev === 0) {
        //  claim automatically
        await ctx.bean.flowTask.claim({ flowTaskId, user });
        await ctx.bean.flowTask.complete({
          flowTaskId,
          handle: { status: 1 },
          user,
        });
      }
    }

    async _addCondition({ flowDefId, node }) {
      const atom = node.options && node.options.atom;
      if (!atom || !atom.module || !atom.atomClassName) {
        // donot delete condition
        // throw error
        throw new Error(`atom not set for startEventAtom: ${flowDefId}.${node.id}`);
      }
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
        flowDefId,
        startEventId,
      });
      if (_condition) {
        // update
        _condition.atomClassId = atomClass.id;
        _condition.conditionExpression = conditionExpression;
        await this.modelCondition.update(_condition);
      } else {
        // insert
        await this.modelCondition.insert({
          flowDefId,
          startEventId,
          atomClassId: atomClass.id,
          conditionExpression,
        });
      }
    }

    async _match({ atom, userId }) {
      // order by atomStatic/conditionExpression
      const list = await ctx.model.query(
        `
          select a.* from aFlowNodeStartEventAtomCondition a
            left join aFlowDef b on a.flowDefId=b.id
            left join aAtom c on b.atomId=c.id
            where a.iid=? and a.atomClassId=?
            order by c.atomStatic asc, a.conditionExpression desc
        `,
        [ctx.instance.id, atom.atomClassId]
      );
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

    async _deleteCondition2({ flowDefId, node }) {
      const startEventId = node.id;
      await this.modelCondition.delete({
        flowDefId,
        startEventId,
      });
    }
  }

  return FlowNode;
};


/***/ }),

/***/ 8723:
/***/ ((module) => {

module.exports = ctx => {
  class IOMessage extends ctx.app.meta.IOMessageBase(ctx) {}
  return IOMessage;
};


/***/ }),

/***/ 5288:
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

/***/ 2895:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flowTask_0 = __webpack_require__(726);
const flowTask_appendHandleRemark = __webpack_require__(7953);
const flowTask_assignees = __webpack_require__(5719);
const flowTask_cancelFlow = __webpack_require__(6578);
const flowTask_claim = __webpack_require__(6481);
const flowTask_complete = __webpack_require__(793);
const flowTask_event = __webpack_require__(3581);
const flowTask_init = __webpack_require__(7411);
const flowTask_recall = __webpack_require__(4050);
const flowTask_forward = __webpack_require__(848);
const flowTask_substitute = __webpack_require__(5927);
const flowTask_schema = __webpack_require__(5441);

module.exports = ctx => {
  return ctx.app.meta.util.mixinClasses(
    flowTask_0,
    [
      flowTask_appendHandleRemark,
      flowTask_assignees,
      flowTask_cancelFlow,
      flowTask_claim,
      flowTask_complete,
      flowTask_event,
      flowTask_init,
      flowTask_recall,
      flowTask_forward,
      flowTask_substitute,
      flowTask_schema,
    ],
    ctx
  );
};


/***/ }),

/***/ 726:
/***/ ((module) => {

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
    get localRight() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.right');
    }
  }
  return FlowTask;
};


/***/ }),

/***/ 7953:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _appendHandleRemark({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTaskHistory;
      // check right
      await this.localRight.appendHandleRemark({ flowTask, user, flowNodeType: this.contextTask._nodeDef.type });
      // only update flowTaskHistory
      this.contextTask._flowTaskHistory.handleRemark = handle.remark;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
    }
  }
  return FlowTask;
};


/***/ }),

/***/ 5719:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _assignees() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // check right
      await this.localRight.assignees({ flowTask, user });
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
            orders: [['a.userName', 'asc']],
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

    async _assigneesConfirmation({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // check right
      await this.localRight.assigneesConfirmation({ flowTask, user });
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
          if (!new Set(assigneesOld).isSuperset(new Set(assignees))) {
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
          nodeInstance: this.nodeInstance,
          rejectedNode: null,
        });
      }
    }
  }
  return FlowTask;
};


/***/ }),

/***/ 6578:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _cancelFlow({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // check right
      await this.localRight.cancelFlow({ flowTask, user, getOptions: () => this._getNodeOptionsTask() });
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
      const remark = 'Cancelled'; // handle.remark;
      await this.nodeInstance.clear({ flowNodeHandleStatus: 3, flowNodeRemark: remark });
      // end flow
      await this.flowInstance._endFlow({ flowHandleStatus: 3, flowRemark: remark });
    }
  }
  return FlowTask;
};


/***/ }),

/***/ 6481:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _claim() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // check right
      const right = await this.localRight.claim({ flowTask, user });
      if (right) return right;
      // flowTask
      const timeClaimed = new Date();
      this.contextTask._flowTask.timeClaimed = timeClaimed;
      this.contextTask._flowTask.flowTaskHidden = 0; // show
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // history
      this.contextTask._flowTaskHistory.timeClaimed = timeClaimed;
      this.contextTask._flowTaskHistory.flowTaskHidden = 0; // show
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // delete recall task: (specificFlag=2)
      const _taskRecall = await ctx.model.queryOne(
        `
          select id,userIdAssignee from aFlowTask
            where iid=? and deleted=0 and flowNodeId=? and specificFlag=2
          `,
        [ctx.instance.id, flowTask.flowNodeId]
      );
      if (_taskRecall) {
        this._notifyTaskHandlings(_taskRecall.userIdAssignee);
        // delete task
        await ctx.model.query(
          `
          delete from aFlowTask
            where iid=? and id=?
          `,
          [ctx.instance.id, _taskRecall.id]
        );
        await ctx.model.query(
          `
          update aFlowTaskHistory set deleted=1
            where iid=? and deleted=0 and flowTaskId=?
          `,
          [ctx.instance.id, _taskRecall.id]
        );
      }
      // check if bidding
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      if (options.bidding) {
        // notify
        const _tasks = await ctx.model.query(
          `
          select id,userIdAssignee from aFlowTask
            where iid=? and deleted=0 and flowNodeId=? and id<>? and (flowTaskStatus=0 and handleStatus=0)
          `,
          [ctx.instance.id, flowTask.flowNodeId, flowTaskId]
        );
        for (const _task of _tasks) {
          this._notifyTaskClaimings(_task.userIdAssignee);
        }
        // delete other tasks
        await ctx.model.query(
          `
          delete from aFlowTask
            where iid=? and flowNodeId=? and id<>? and (flowTaskStatus=0 and handleStatus=0)
          `,
          [ctx.instance.id, flowTask.flowNodeId, flowTaskId]
        );
        await ctx.model.query(
          `
          update aFlowTaskHistory set deleted=1
            where iid=? and deleted=0 and flowNodeId=? and flowTaskId<>? and (flowTaskStatus=0 and handleStatus=0)
          `,
          [ctx.instance.id, flowTask.flowNodeId, flowTaskId]
        );
      }
      // event: task.claimed
      await this.raiseEventClaimed();
      // notify
      this._notifyTaskClaimings(flowTask.userIdAssignee);
      this._notifyTaskHandlings(flowTask.userIdAssignee);
      // ok
      return { timeClaimed };
    }
  }
  return FlowTask;
};


/***/ }),

/***/ 793:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _complete({ handle, formAtom }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // check right
      await this.localRight.complete({ flowTask, user, handle, getOptions: () => this._getNodeOptionsTask() });
      // formAtom
      if (formAtom) {
        await this._complete_formAtom({ formAtom });
      }
      // handle
      if (handle) {
        await this._complete_handle({ handle });
        // event: task.completed
        await this.raiseEventCompleted();
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
            context: { flowNodeId },
            fn: '_nodeDoneCheckLock',
            transaction: true,
            ctxParent: { state: { user: { op: user } } },
          });
        },
      });
    }

    async _complete_formAtom({ formAtom }) {
      // schemaWrite
      const schemaWrite = await this._getSchemaWrite();
      if (!schemaWrite) return;
      // write
      const atomId = this.context._atom.atomId;
      const user = this.contextTask._user;
      await ctx.bean.atom.write({
        key: { atomId },
        item: formAtom,
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
      // special for forward
      await this._complete_handle_checkForward();
      // special for substitute
      await this._complete_handle_checkSubstitute();
    }

    async _complete_handle_checkForward() {
      let flowTaskIdForwardFrom = this.contextTask._flowTask.flowTaskIdForwardFrom;
      if (!flowTaskIdForwardFrom) return;
      while (flowTaskIdForwardFrom) {
        const taskFrom = await this.modelFlowTask.get({ id: flowTaskIdForwardFrom });
        await this.modelFlowTask.update({
          id: flowTaskIdForwardFrom,
          flowTaskStatus: 1,
        });
        await this.modelFlowTaskHistory.update(
          {
            flowTaskStatus: 1,
          },
          {
            where: {
              flowTaskId: flowTaskIdForwardFrom,
            },
          }
        );
        // notify
        this._notifyTaskHandlings(taskFrom.userIdAssignee);
        // next
        flowTaskIdForwardFrom = taskFrom.flowTaskIdForwardFrom;
      }
    }

    async _complete_handle_checkSubstitute() {
      let flowTaskIdSubstituteFrom = this.contextTask._flowTask.flowTaskIdSubstituteFrom;
      if (!flowTaskIdSubstituteFrom) return;
      while (flowTaskIdSubstituteFrom) {
        const taskFrom = await this.modelFlowTask.get({ id: flowTaskIdSubstituteFrom });
        await this.modelFlowTask.update({
          id: flowTaskIdSubstituteFrom,
          flowTaskStatus: 1,
        });
        await this.modelFlowTaskHistory.update(
          {
            flowTaskStatus: 1,
          },
          {
            where: {
              flowTaskId: flowTaskIdSubstituteFrom,
            },
          }
        );
        // notify
        this._notifyTaskHandlings(taskFrom.userIdAssignee);
        // next
        flowTaskIdSubstituteFrom = taskFrom.flowTaskIdSubstituteFrom;
      }
    }
  }
  return FlowTask;
};


/***/ }),

/***/ 3581:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async raiseEventCreated() {
      await this.nodeInstance.change({
        event: 'created',
        taskInstance: this,
      });
      await this._saveVars();
    }

    async raiseEventClaimed() {
      await this.nodeInstance.change({
        event: 'claimed',
        taskInstance: this,
      });
      await this._saveVars();
    }

    async raiseEventCompleted() {
      await this.nodeInstance.change({
        event: 'completed',
        taskInstance: this,
      });
      await this._saveVars();
    }

    async _saveTaskVars() {
      if (!this.contextTask._taskVars._dirty) return;
      // flowTask
      this.contextTask._flowTask.taskVars = JSON.stringify(this.contextTask._taskVars._vars);
      // modelFlowTask maybe deleted when flowTaskStatus=1
      if (this.contextTask._flowTaskHistory.flowTaskStatus === 0) {
        await this.modelFlowTask.update(this.contextTask._flowTask);
      }
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

/***/ 848:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    // handle: assignee/remark
    async _forward({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // check right
      await this.localRight.forward({ flowTask, user, getOptions: () => this._getNodeOptionsTask() });
      // handle
      await this._forward_handle({ handle });
      // need not notify
      // this._notifyTaskHandlings(flowTask.userIdAssignee);
    }

    // 1. create a new task
    // 2. update handleStatus/handleRemark
    async _forward_handle({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // 1. create a new task
      const taskInstance = await ctx.bean.flowTask._createTaskInstance({
        nodeInstance: this.nodeInstance,
        userIdAssignee: handle.assignee,
        user,
      });
      // specificFlag: 4
      taskInstance.contextTask._flowTask.specificFlag = 4;
      taskInstance.contextTask._flowTask.flowTaskIdForwardFrom = flowTaskId;
      await taskInstance.modelFlowTask.update(taskInstance.contextTask._flowTask);
      // history
      taskInstance.contextTask._flowTaskHistory.specificFlag = 4;
      taskInstance.contextTask._flowTaskHistory.flowTaskIdForwardFrom = flowTaskId;
      await taskInstance.modelFlowTaskHistory.update(taskInstance.contextTask._flowTaskHistory);
      // notify
      taskInstance._notifyTaskClaimings(taskInstance.contextTask._flowTask.userIdAssignee);
      // 2. update
      // flowTask
      const flowTaskIdForwardTo = taskInstance.contextTask._flowTask.id;
      const timeHandled = new Date();
      this.contextTask._flowTask.timeHandled = timeHandled;
      this.contextTask._flowTask.handleStatus = 4;
      this.contextTask._flowTask.handleRemark = handle.remark;
      this.contextTask._flowTask.flowTaskIdForwardTo = flowTaskIdForwardTo;
      this.contextTask._flowTask.ignoreMark = 1;
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // flowTaskHistory update
      this.contextTask._flowTaskHistory.timeHandled = timeHandled;
      this.contextTask._flowTaskHistory.handleStatus = 4;
      this.contextTask._flowTaskHistory.handleRemark = handle.remark;
      this.contextTask._flowTaskHistory.flowTaskIdForwardTo = flowTaskIdForwardTo;
      this.contextTask._flowTaskHistory.ignoreMark = 1;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
    }

    async _forwardRecall() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // check right
      await this.localRight.forwardRecall({ flowTask, user, getOptions: () => this._getNodeOptionsTask() });
      // handle
      await this._forwardRecall_handle();
    }

    // 1. delete task
    // 2. update task
    async _forwardRecall_handle() {
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // 1. delete task
      const taskTo = await this.modelFlowTask.get({ id: flowTask.flowTaskIdForwardTo });
      // delete flowTask and flowTaskHistory
      await this.modelFlowTask.delete({ id: taskTo.id });
      await this.modelFlowTaskHistory.delete({ flowTaskId: taskTo.id });
      // notify
      this._notifyTaskClaimings(taskTo.userIdAssignee);
      // 2. update
      // flowTask
      this.contextTask._flowTask.timeHandled = null;
      this.contextTask._flowTask.handleStatus = 0;
      this.contextTask._flowTask.handleRemark = null;
      this.contextTask._flowTask.flowTaskIdForwardTo = 0;
      this.contextTask._flowTask.ignoreMark = 0;
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // flowTaskHistory update
      this.contextTask._flowTaskHistory.timeHandled = null;
      this.contextTask._flowTaskHistory.handleStatus = 0;
      this.contextTask._flowTaskHistory.handleRemark = null;
      this.contextTask._flowTaskHistory.flowTaskIdForwardTo = 0;
      this.contextTask._flowTaskHistory.ignoreMark = 0;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
    }
  }
  return FlowTask;
};


/***/ }),

/***/ 7411:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const VarsFn = __webpack_require__(1418);
const UtilsFn = __webpack_require__(9294);

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async init({ userIdAssignee, user }) {
      // create flowTask
      const flowTaskId = await this._createFlowTask({ userIdAssignee, user });
      // context init
      await this._contextInit({ flowTaskId, user });
      // event
      await this.raiseEventCreated();
    }

    async _load({ flowTask, user, history }) {
      // context init
      await this._contextInit({ flowTaskId: flowTask.id, user, history });
    }

    async _createFlowTask({ userIdAssignee, user }) {
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
      // publish uniform message
      if (userIdAssignee !== user.id) {
        const userFlow = await ctx.bean.user.get({ id: this.context._flow.flowUserId });
        const userAssignee = await ctx.bean.user.get({ id: userIdAssignee });
        const title = `${ctx.text.locale(userAssignee.locale, 'Task')} - ${ctx.text.locale(
          userAssignee.locale,
          this.contextNode._flowNode.flowNodeName
        )}`;
        const actionPath = `/a/flowtask/flow?flowId=${this.context._flowId}&flowTaskId=${flowTaskId}`;
        const message = {
          userIdTo: userIdAssignee,
          content: {
            issuerId: userFlow.id,
            issuerName: userFlow.userName,
            issuerAvatar: userFlow.avatar,
            title,
            body: this.context._flow.flowName,
            actionPath,
            params: {
              flowId: this.context._flowId,
              flowTaskId,
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
      this.contextTask._taskVars._vars = this.contextTask._flowTaskHistory.taskVars
        ? JSON.parse(this.contextTask._flowTaskHistory.taskVars)
        : {};
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

    _getNodeOptionsTask() {
      return ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
    }
  }
  return FlowTask;
};


/***/ }),

/***/ 4050:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _recall() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // check right
      await this.localRight.recall({ flowTask, user });
      // handle
      await this._recall_handle();
      // notify
      this._notifyTaskHandlings(flowTask.userIdAssignee);
    }

    async _recall_handle() {
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // flowTaskHistory update
      this.contextTask._flowTaskHistory.flowTaskStatus = 1;
      this.contextTask._flowTaskHistory.timeHandled = new Date();
      this.contextTask._flowTaskHistory.handleStatus = 1;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // delete flowTask and flowTaskHistory
      await this.modelFlowTask.delete({ id: flowTaskId });
      await this.modelFlowTaskHistory.delete({ flowTaskId });
      // notify
      const _tasks = await ctx.model.query(
        `
          select id,userIdAssignee from aFlowTask
            where iid=? and deleted=0 and flowNodeId=? and id<>?
          `,
        [ctx.instance.id, flowTask.flowNodeId, flowTaskId]
      );
      for (const _task of _tasks) {
        this._notifyTaskClaimings(_task.userIdAssignee);
      }
      // delete other tasks
      await ctx.model.query(
        `
          delete from aFlowTask
            where iid=? and flowNodeId=? and id<>?
          `,
        [ctx.instance.id, flowTask.flowNodeId, flowTaskId]
      );
      await ctx.model.query(
        `
          update aFlowTaskHistory set deleted=1
            where iid=? and deleted=0 and flowNodeId=? and flowTaskId<>?
          `,
        [ctx.instance.id, flowTask.flowNodeId, flowTaskId]
      );
      // recall
      return await ctx.bean.flowTask._gotoFlowNodePrevious({
        nodeInstance: this.nodeInstance,
        rejectedNode: null,
        flowNodeRemark: 'Recalled',
      });
    }
  }
  return FlowTask;
};


/***/ }),

/***/ 5441:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(5638);
const extend = require3('extend2');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
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
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) {
        ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      }
      // must be the same flowId, means not outdated
      if (atom.atomFlowId !== this.context._flowId) ctx.throw.module('a-flow', 1009, this.context._flowId);
      // special for write
      if (mode === 'write') {
        // check handled
        if (flowTask.flowTaskStatus !== 0) ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      }
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
      fields.atomNameLocale = {};
      fields.atomCategoryName = {};
      fields.atomCategoryNameLocale = {};
      fields.flowNodeNameCurrent = {};
      fields.flowNodeNameCurrentLocale = {};
      fields._meta = {};
      for (const field in fields) {
        if (item[field] === undefined && atom[field] !== undefined) {
          item[field] = atom[field];
        }
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
      const res = await this.flowInstance._flowListener[methodName](this.contextTask, this.contextNode, {
        schemaBase,
        schema,
      });
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
  }
  return FlowTask;
};


/***/ }),

/***/ 5927:
/***/ ((module) => {

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    // handle: assignee/remark
    async _substitute({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // check right
      await this.localRight.substitute({ flowTask, user, getOptions: () => this._getNodeOptionsTask() });
      // handle
      await this._substitute_handle({ handle });
      // need not notify
      // this._notifyTaskHandlings(flowTask.userIdAssignee);
    }

    // 1. create a new task
    // 2. update handleStatus/handleRemark
    async _substitute_handle({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // 1. create a new task
      const taskInstance = await ctx.bean.flowTask._createTaskInstance({
        nodeInstance: this.nodeInstance,
        userIdAssignee: handle.assignee,
        user,
      });
      // specificFlag: 5
      taskInstance.contextTask._flowTask.specificFlag = 5;
      taskInstance.contextTask._flowTask.flowTaskIdSubstituteFrom = flowTaskId;
      await taskInstance.modelFlowTask.update(taskInstance.contextTask._flowTask);
      // history
      taskInstance.contextTask._flowTaskHistory.specificFlag = 5;
      taskInstance.contextTask._flowTaskHistory.flowTaskIdSubstituteFrom = flowTaskId;
      await taskInstance.modelFlowTaskHistory.update(taskInstance.contextTask._flowTaskHistory);
      // notify
      taskInstance._notifyTaskClaimings(taskInstance.contextTask._flowTask.userIdAssignee);
      // 2. update
      // flowTask
      const flowTaskIdSubstituteTo = taskInstance.contextTask._flowTask.id;
      const timeHandled = new Date();
      this.contextTask._flowTask.timeHandled = timeHandled;
      this.contextTask._flowTask.handleStatus = 5;
      this.contextTask._flowTask.handleRemark = handle.remark;
      this.contextTask._flowTask.flowTaskIdSubstituteTo = flowTaskIdSubstituteTo;
      this.contextTask._flowTask.ignoreMark = 1;
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // flowTaskHistory update
      this.contextTask._flowTaskHistory.timeHandled = timeHandled;
      this.contextTask._flowTaskHistory.handleStatus = 5;
      this.contextTask._flowTaskHistory.handleRemark = handle.remark;
      this.contextTask._flowTaskHistory.flowTaskIdSubstituteTo = flowTaskIdSubstituteTo;
      this.contextTask._flowTaskHistory.ignoreMark = 1;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
    }

    async _substituteRecall() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // check right
      await this.localRight.substituteRecall({ flowTask, user, getOptions: () => this._getNodeOptionsTask() });
      // handle
      await this._substituteRecall_handle();
    }

    // 1. delete task
    // 2. update task
    async _substituteRecall_handle() {
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // 1. delete task
      const taskTo = await this.modelFlowTask.get({ id: flowTask.flowTaskIdSubstituteTo });
      // delete flowTask and flowTaskHistory
      await this.modelFlowTask.delete({ id: taskTo.id });
      await this.modelFlowTaskHistory.delete({ flowTaskId: taskTo.id });
      // notify
      this._notifyTaskClaimings(taskTo.userIdAssignee);
      // 2. update
      // flowTask
      this.contextTask._flowTask.timeHandled = null;
      this.contextTask._flowTask.handleStatus = 0;
      this.contextTask._flowTask.handleRemark = null;
      this.contextTask._flowTask.flowTaskIdSubstituteTo = 0;
      this.contextTask._flowTask.ignoreMark = 0;
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // flowTaskHistory update
      this.contextTask._flowTaskHistory.timeHandled = null;
      this.contextTask._flowTaskHistory.handleStatus = 0;
      this.contextTask._flowTaskHistory.handleRemark = null;
      this.contextTask._flowTaskHistory.flowTaskIdSubstituteTo = 0;
      this.contextTask._flowTaskHistory.ignoreMark = 0;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
    }
  }
  return FlowTask;
};


/***/ }),

/***/ 2716:
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
      // -- e: aUser(for flowUserId)

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
            d.userName,d.avatar,
            e.userName as flowUserName,e.avatar as flowUserAvatar
          `;
      }

      // sql
      const _sql = `select ${_selectFields} from aFlowTask a
            inner join aFlowNode b on a.flowNodeId=b.id
            inner join aFlow c on a.flowId=c.id
            left join aUser d on a.userIdAssignee=d.id
            left join aUser e on c.flowUserId=e.id

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
      // -- e: aUser(for flowUserId)

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
            b.flowNodeDefId,b.flowNodeName,b.flowNodeType,b.flowNodeStatus,b.flowNodeHandleStatus,b.flowNodeRemark,b.timeDone,
            c.flowDefId,c.flowDefKey,c.flowDefRevision,c.flowName,c.flowStatus,c.flowAtomId,c.flowNodeIdCurrent,c.flowUserId,
            d.userName,d.avatar,
            e.userName as flowUserName,e.avatar as flowUserAvatar
          `;
      }

      // sql
      const _sql = `select ${_selectFields} from aFlowTaskHistory a
            inner join aFlowNodeHistory b on a.flowNodeId=b.flowNodeId
            inner join aFlowHistory c on a.flowId=c.flowId
            left join aUser d on a.userIdAssignee=d.id
            left join aUser e on c.flowUserId=e.id

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

/***/ 3751:
/***/ ((module) => {

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Right {
    get modelFlowTask() {
      return ctx.model.module(moduleInfo.relativeName).flowTask;
    }
    _check_specificFlag_normal({ flowTask }) {
      if (flowTask.specificFlag === 1 || flowTask.specificFlag === 2) ctx.throw(403);
    }
    _check_specificFlag_0({ flowTask }) {
      if (flowTask.specificFlag !== 0) ctx.throw(403);
    }
    _check_specificFlag_1({ flowTask }) {
      if (flowTask.specificFlag !== 1) ctx.throw(403);
    }
    _check_specificFlag_2({ flowTask }) {
      if (flowTask.specificFlag !== 2) ctx.throw(403);
    }
    _check_sameUser({ flowTask, user }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) {
        ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      }
    }
    _check_notDone({ flowTask }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // not complete
      if (flowTask.flowTaskStatus === 1) {
        ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      }
    }
    _check_notDoneAndHandled({ flowTask }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // not complete and not handled
      if (flowTask.flowTaskStatus === 1 || flowTask.handleStatus !== 0) {
        ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      }
    }
    _check_claimed({ flowTask }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // timeClaimed first
      if (!flowTask.timeClaimed) {
        ctx.throw.module(moduleInfo.relativeName, 1004, flowTaskId);
      }
    }
    async _getNodeOptionsTask({ getOptions, flowTask, nodeInstance }) {
      if (getOptions) return await getOptions();
      if (!nodeInstance) {
        nodeInstance = await ctx.bean.flow._loadFlowNodeInstance({ flowNodeId: flowTask.flowNodeId });
      }
      return ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance });
    }
    async _getTask({ getTask, flowTaskId }) {
      if (getTask) return await getTask(flowTaskId);
      return await this.modelFlowTask.get({ id: flowTaskId });
    }
    async appendHandleRemark({ flowTask, user, flowNodeType }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // more check
      if (flowNodeType !== 'startEventAtom' || flowTask.flowTaskStatus !== 1 || flowTask.handleRemark) {
        ctx.throw.module(moduleInfo.relativeName, 1011, flowTaskId);
      }
    }
    async assignees({ flowTask, user }) {
      // specificFlag must be 1
      this._check_specificFlag_1({ flowTask });
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDoneAndHandled({ flowTask });
      // timeClaimed first
      this._check_claimed({ flowTask });
    }
    async assigneesConfirmation({ flowTask, user }) {
      // same as assignees
      return await this.assignees({ flowTask, user });
    }
    async cancelFlow({ flowTask, user, getOptions, disableCheckTimeClaimed }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // specificFlag must be normal
      this._check_specificFlag_normal({ flowTask });
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDoneAndHandled({ flowTask });
      // timeClaimed first
      if (!disableCheckTimeClaimed) {
        this._check_claimed({ flowTask });
      }
      // options
      const options = await this._getNodeOptionsTask({ getOptions, flowTask });
      // check if allowCancelFlow
      if (!options.allowCancelFlow) {
        ctx.throw.module(moduleInfo.relativeName, 1010, flowTaskId);
      }
    }
    async claim({ flowTask, user }) {
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDoneAndHandled({ flowTask });
      // check: not throw error
      // if (flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1003, flowTaskId);
      if (flowTask.timeClaimed) {
        return { timeClaimed: flowTask.timeClaimed };
      }
    }
    async complete({ flowTask, user, handle, getOptions, disableCheckTimeClaimed }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // specificFlag must be normal
      this._check_specificFlag_normal({ flowTask });
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDoneAndHandled({ flowTask });
      // timeClaimed first
      if (!disableCheckTimeClaimed) {
        this._check_claimed({ flowTask });
      }
      // options
      const options = await this._getNodeOptionsTask({ getOptions, flowTask });
      // check if pass/reject
      if (handle) {
        if (handle.status === 1 && !options.allowPassTask) {
          ctx.throw.module(moduleInfo.relativeName, 1006, flowTaskId);
        }
        if (handle.status === 2 && !options.allowRejectTask) {
          ctx.throw.module(moduleInfo.relativeName, 1007, flowTaskId);
        }
      } else if (!options.allowPassTask && !options.allowRejectTask) {
        ctx.throw(403);
      }
    }
    async recall({ flowTask, user }) {
      // specificFlag must be 2
      this._check_specificFlag_2({ flowTask });
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDoneAndHandled({ flowTask });
      // timeClaimed first
      this._check_claimed({ flowTask });
    }
    async forward({ flowTask, user, getOptions, disableCheckTimeClaimed }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDoneAndHandled({ flowTask });
      // timeClaimed first
      if (!disableCheckTimeClaimed) {
        this._check_claimed({ flowTask });
      }
      // check if flowTaskIdSubstituteFrom
      if (flowTask.flowTaskIdSubstituteFrom) {
        ctx.throw(403);
      }
      // options
      const options = await this._getNodeOptionsTask({ getOptions, flowTask });
      if (!options.allowForward || flowTask.flowTaskIdForwardTo) {
        ctx.throw.module(moduleInfo.relativeName, 1012, flowTaskId);
      }
    }
    async forwardRecall({ flowTask, user, getOptions, getTask }) {
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDone({ flowTask });
      // timeClaimed first
      this._check_claimed({ flowTask });
      // options
      const options = await this._getNodeOptionsTask({ getOptions, flowTask });
      if (!options.allowForward || !flowTask.flowTaskIdForwardTo) {
        ctx.throw(403);
      }
      // check if claimed
      const taskTo = await this._getTask({ getTask, flowTaskId: flowTask.flowTaskIdForwardTo });
      if (taskTo.timeClaimed) {
        ctx.throw(403);
      }
    }
    async substitute({ flowTask, user, getOptions, disableCheckTimeClaimed }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDoneAndHandled({ flowTask });
      // timeClaimed first
      if (!disableCheckTimeClaimed) {
        this._check_claimed({ flowTask });
      }
      // options
      const options = await this._getNodeOptionsTask({ getOptions, flowTask });
      // allowed only once, so should check flowTaskIdSubstituteFrom
      if (!options.allowSubstitute || flowTask.flowTaskIdSubstituteFrom || flowTask.flowTaskIdSubstituteTo) {
        ctx.throw.module(moduleInfo.relativeName, 1013, flowTaskId);
      }
    }
    async substituteRecall({ flowTask, user, getOptions, getTask }) {
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDone({ flowTask });
      // timeClaimed first
      this._check_claimed({ flowTask });
      // options
      const options = await this._getNodeOptionsTask({ getOptions, flowTask });
      // allowed only once, so should check flowTaskIdSubstituteFrom
      if (!options.allowSubstitute || flowTask.flowTaskIdSubstituteFrom || !flowTask.flowTaskIdSubstituteTo) {
        ctx.throw(403);
      }
      // check if claimed
      const taskTo = await this._getTask({ getTask, flowTaskId: flowTask.flowTaskIdSubstituteTo });
      if (taskTo.timeClaimed) {
        ctx.throw(403);
      }
    }
  }

  return Right;
};


/***/ }),

/***/ 2951:
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

/***/ 4843:
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

/***/ 6899:
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

      if (options.version === 2) {
        let sql;

        // aFlowTask
        sql = `
          ALTER TABLE aFlowTask
            ADD COLUMN ignoreMark int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdForwardFrom int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdForwardTo int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdSubstituteFrom int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdSubstituteTo int(11) DEFAULT '0'
                `;
        await this.ctx.model.query(sql);

        // aFlowTaskHistory
        sql = `
          ALTER TABLE aFlowTaskHistory
            ADD COLUMN ignoreMark int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdForwardFrom int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdForwardTo int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdSubstituteFrom int(11) DEFAULT '0',
            ADD COLUMN flowTaskIdSubstituteTo int(11) DEFAULT '0'
                `;
        await this.ctx.model.query(sql);
      }
    }

    async init(options) {}

    async test() {}
  }

  return Version;
};


/***/ }),

/***/ 5187:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const versionManager = __webpack_require__(6899);
const flowNodeStartEventAtom = __webpack_require__(2252);
const flowNodeEndEventAtom = __webpack_require__(5895);
const flowNodeActivityUserTask = __webpack_require__(4892);
const localContextTask = __webpack_require__(5288);
const localFlowTask = __webpack_require__(2895);
const localProcedure = __webpack_require__(2716);
const localRight = __webpack_require__(3751);
const beanFlowTask = __webpack_require__(2302);
const statsTaskClaimings = __webpack_require__(2951);
const statsTaskHandlings = __webpack_require__(4843);
const ioMessageWorkflow = __webpack_require__(8723);

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
    'flow.node.endEventAtom': {
      mode: 'ctx',
      bean: flowNodeEndEventAtom,
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
    'local.right': {
      mode: 'ctx',
      bean: localRight,
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
    // io
    'io.message.workflow': {
      mode: 'ctx',
      bean: ioMessageWorkflow,
    },
  };
  return beans;
};


/***/ }),

/***/ 3271:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const require3 = __webpack_require__(5638);
const assert = require3('assert');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNodeActivityUserTaskBase extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeEnter() {
      // super
      let res = await super.onNodeEnter();
      if (!res) return res;

      // options
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({
        nodeInstance: this.nodeInstance,
      });

      // prepare assignees
      res = await this._prepareAssignees({ options });
      if (!res) return false;

      // ok
      return true;
    }

    async onNodeBegin() {
      // super
      const res = await super.onNodeBegin();
      if (!res) return res;

      // options
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({
        nodeInstance: this.nodeInstance,
      });

      // user
      const user = this.flowInstance._getOpUser();

      // var: _assigneesConfirmation
      const assignees = this.contextNode.vars.get('_assigneesConfirmation');
      assert(assignees && assignees.length > 0);

      // recall
      if (options.allowRecall) {
        const taskInstance = await ctx.bean.flowTask._createTaskInstance({
          nodeInstance: this.nodeInstance,
          userIdAssignee: user.id,
          user,
        });
        await this._taskConfirmationClaim({ taskInstance, specificFlag: 2 });
      }

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
      const res = await super.onNodeDoing();
      if (!res) return res;

      // break
      return false;
    }

    async onNodeClear({ options }) {
      await ctx.bean.flowTask._clearRemains({ nodeInstance: this.nodeInstance });
      // super
      return await super.onNodeClear({ options });
    }

    async onNodeChange({ options }) {
      const { event, taskInstance } = options;
      if (event === 'created') {
        await taskInstance.flowInstance._flowListener.onTaskCreated(taskInstance.contextTask, taskInstance.contextNode);
      } else if (event === 'claimed') {
        await taskInstance.flowInstance._flowListener.onTaskClaimed(taskInstance.contextTask, taskInstance.contextNode);
      } else if (event === 'completed') {
        await taskInstance.flowInstance._flowListener.onTaskCompleted(
          taskInstance.contextTask,
          taskInstance.contextNode
        );
      }
      // super
      return await super.onNodeChange({ options });
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
        await this._taskConfirmationClaim({ taskInstance, specificFlag: 1 });
        // break
        return false;
      }

      // save var: _assigneesConfirmation
      this.contextNode.vars.set('_assigneesConfirmation', assignees);

      // ok
      return true;
    }

    async _taskConfirmationClaim({ taskInstance, specificFlag }) {
      // specificFlag timeClaimed
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

/***/ 9294:
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

/***/ 5624:
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
  1011: 'Task Handle Remark cannot be appended: %s',
  1012: 'Task has been forwarded: %s',
  1013: 'Task has been substituted: %s',
};


/***/ }),

/***/ 3614:
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
      allowRecall: false,
      allowForward: false,
      allowSubstitute: false,
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
    showAssignees: true,
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
    allowRecall: true,
    allowForward: false,
    allowSubstitute: false,
    schema: {
      read: true,
      write: false,
    },
  },
};


/***/ }),

/***/ 8587:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const defaults = __webpack_require__(3614);

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const nodes = {
    // events
    startEventAtom: {
      title: 'StartEventAtom',
      group: 'startEvent',
      bean: 'startEventAtom',
      icon: '/api/static/a/flowtask/bpmn/events/start-event-atom.svg',
      validator: {
        module: moduleInfo.relativeName,
        validator: 'startEventAtom',
      },
    },
    endEventAtom: {
      title: 'EndEventAtom',
      group: 'endEvent',
      bean: 'endEventAtom',
      icon: '/api/static/a/flowtask/bpmn/events/end-event-atom.svg',
    },
    // activities
    activityUserTask: {
      title: 'ActivityUserTask',
      group: 'activity',
      bean: 'activityUserTask',
      icon: '/api/static/a/flowtask/bpmn/activities/activity-user-task.svg',
      validator: {
        module: moduleInfo.relativeName,
        validator: 'activityUserTask',
      },
    },
  };

  for (const key in nodes) {
    const node = nodes[key];
    node.options = {};
    if (defaults[key]) {
      node.options.default = defaults[key];
    }
  }

  return nodes;
};


/***/ }),

/***/ 6327:
/***/ ((module) => {

module.exports = {
  StartEventAtom: 'StartEvent: Data Draft',
  EndEventAtom: 'EndEvent: Data Submit',
  ActivityUserTask: 'Activity: User Task',
};


/***/ }),

/***/ 3072:
/***/ ((module) => {

module.exports = {
  Submitted: '已提交',
  StartEventAtom: '数据起草开始事件',
  EndEventAtom: '数据提交结束事件',
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
  'Task Handle Remark cannot be appended: %s': '任务处理意见不允许追加: %s',
  'Task has been forwarded: %s': '任务已被转办: %s',
  'Task has been substituted: %s': '任务已被代办: %s',
};


/***/ }),

/***/ 25:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = {
  'en-us': __webpack_require__(6327),
  'zh-cn': __webpack_require__(3072),
};


/***/ }),

/***/ 6526:
/***/ ((module) => {

module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const schemas = {};
  // activityUserTask
  schemas.activityUserTask = {
    type: 'object',
    properties: {
      assignees: {
        type: 'object',
        ebType: 'component',
        ebTitle: 'Assignees',
        ebRender: {
          module: 'a-flowchart',
          name: 'renderAssignees',
        },
        notEmpty: true,
      },
      showAssignees: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Show Assignees',
      },
      confirmation: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Confirmation Assignees',
      },
      confirmationAllowAppend: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'ConfirmationAllowAppend',
      },
      bidding: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Bidding',
      },
      completionCondition: {
        type: 'object',
        ebType: 'json',
        ebTitle: 'Completion Condition',
        notEmpty: true,
      },
      rejectedNode: {
        type: 'string',
        ebType: 'component',
        ebTitle: 'Rejected Node',
        ebRender: {
          module: 'a-flowchart',
          name: 'renderRejectedNode',
        },
      },
      allowPassTask: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Pass Task',
      },
      allowRejectTask: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Reject Task',
      },
      allowCancelFlow: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Cancel Flow',
      },
      allowRecall: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Recall',
      },
      allowForward: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Forward',
      },
      allowSubstitute: {
        type: 'boolean',
        ebType: 'toggle',
        ebTitle: 'Allow Substitute',
      },
      schema: {
        type: 'object',
        ebType: 'component',
        ebTitle: 'Field Permissions',
        ebRender: {
          module: 'a-flowchart',
          name: 'renderSchemaFields',
        },
        notEmpty: true,
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 2818:
/***/ ((module) => {

module.exports = app => {
  const schemas = {};
  // startEventAtom
  schemas.startEventAtom = {
    type: 'object',
    properties: {
      atom: {
        type: 'object',
        ebType: 'atomClass',
        ebTitle: 'Atom Class',
        notEmpty: true,
        ebParams: {
          simple: 0,
        },
      },
      conditionExpression: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Condition Expression',
        ebTextarea: true,
      },
      task: {
        type: 'object',
        ebType: 'panel',
        ebTitle: 'User Task Options',
        $ref: 'activityUserTask',
      },
    },
  };
  return schemas;
};


/***/ }),

/***/ 8232:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const startEventAtom = __webpack_require__(2818);
const activityUserTask = __webpack_require__(6526);

module.exports = app => {
  const schemas = {};
  // startEventAtom
  Object.assign(schemas, startEventAtom(app));
  // activityUserTask
  Object.assign(schemas, activityUserTask(app));
  // ok
  return schemas;
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

    async appendHandleRemark() {
      const res = await this.ctx.service.flowTask.appendHandleRemark({
        flowTaskId: this.ctx.request.body.flowTaskId,
        handle: this.ctx.request.body.handle,
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

    async recall() {
      const res = await this.ctx.service.flowTask.recall({
        flowTaskId: this.ctx.request.body.flowTaskId,
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

    async userSelectForward() {
      const { flowTaskId, params } = this.ctx.request.body;
      const user = this.ctx.state.user.op;
      const page = params.page;
      const items = await this.ctx.service.flowTask.userSelectForward({
        flowTaskId,
        params,
        user,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async forward() {
      const res = await this.ctx.service.flowTask.forward({
        flowTaskId: this.ctx.request.body.flowTaskId,
        handle: this.ctx.request.body.handle,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async forwardRecall() {
      const res = await this.ctx.service.flowTask.forwardRecall({
        flowTaskId: this.ctx.request.body.flowTaskId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async userSelectSubstitute() {
      const { flowTaskId, params } = this.ctx.request.body;
      const user = this.ctx.state.user.op;
      const page = params.page;
      const items = await this.ctx.service.flowTask.userSelectSubstitute({
        flowTaskId,
        params,
        user,
      });
      this.ctx.successMore(items, page.index, page.size);
    }

    async substitute() {
      const res = await this.ctx.service.flowTask.substitute({
        flowTaskId: this.ctx.request.body.flowTaskId,
        handle: this.ctx.request.body.handle,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }

    async substituteRecall() {
      const res = await this.ctx.service.flowTask.substituteRecall({
        flowTaskId: this.ctx.request.body.flowTaskId,
        user: this.ctx.state.user.op,
      });
      this.ctx.success(res);
    }
  }
  return FlowTaskController;
};


/***/ }),

/***/ 7095:
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

/***/ 9421:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const config = __webpack_require__(7076);
const locales = __webpack_require__(25);
const errors = __webpack_require__(5624);

module.exports = app => {
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
    meta,
  };
};


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = app => {
  const schemas = __webpack_require__(8232)(app);
  const flowNodes = __webpack_require__(8587)(app);
  const meta = {
    base: {
      atoms: {},
    },
    validation: {
      validators: {
        // startEventAtom
        startEventAtom: {
          schemas: 'startEventAtom,activityUserTask',
        },
        // activityUserTask
        activityUserTask: {
          schemas: 'activityUserTask',
        },
      },
      keywords: {},
      schemas,
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
          dependencies: ['a-flowtask:taskClaimings', 'a-flowtask:taskHandlings'],
        },
      },
    },
  };
  return meta;
};


/***/ }),

/***/ 6514:
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

/***/ 6688:
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

/***/ 3230:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flowNodeStartEventAtomCondition = __webpack_require__(6514);
const flowTask = __webpack_require__(6688);
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

/***/ 3825:
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
    { method: 'post', path: 'task/appendHandleRemark', controller: 'flowTask' },
    { method: 'post', path: 'task/assignees', controller: 'flowTask' },
    { method: 'post', path: 'task/assigneesConfirmation', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/recall', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/cancelFlow', controller: 'flowTask', middlewares: 'transaction' },
    { method: 'post', path: 'task/viewAtom', controller: 'flowTask' },
    { method: 'post', path: 'task/editAtom', controller: 'flowTask' },
    { method: 'post', path: 'task/userSelectForward', controller: 'flowTask' },
    { method: 'post', path: 'task/forward', controller: 'flowTask' },
    { method: 'post', path: 'task/forwardRecall', controller: 'flowTask' },
    { method: 'post', path: 'task/userSelectSubstitute', controller: 'flowTask' },
    { method: 'post', path: 'task/substitute', controller: 'flowTask' },
    { method: 'post', path: 'task/substituteRecall', controller: 'flowTask' },
  ];
  return routes;
};


/***/ }),

/***/ 4934:
/***/ ((module) => {

module.exports = app => {
  class Flow extends app.Service {
    async data({ flowId, user }) {
      return await this.ctx.bean.flowTask.flowData({ flowId, user });
    }
  }
  return Flow;
};


/***/ }),

/***/ 3199:
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

    async appendHandleRemark({ flowTaskId, handle, user }) {
      return await this.ctx.bean.flowTask.appendHandleRemark({ flowTaskId, handle, user });
    }

    async assignees({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.assignees({ flowTaskId, user });
    }

    async assigneesConfirmation({ flowTaskId, handle, user }) {
      return await this.ctx.bean.flowTask.assigneesConfirmation({ flowTaskId, handle, user });
    }

    async recall({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.recall({ flowTaskId, user });
    }

    async cancelFlow({ flowTaskId, handle, user }) {
      return await this.ctx.bean.flowTask.cancelFlow({ flowTaskId, handle, user });
    }

    async viewAtom({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.viewAtom({ flowTaskId, user });
    }

    async editAtom({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.editAtom({ flowTaskId, user });
    }

    async userSelectForward({ flowTaskId, params, user }) {
      // check right
      const flowTask = await this.ctx.model.flowTask.get({ id: flowTaskId });
      await this.ctx.bean.local.right.forward({ flowTask, user });
      // users
      return await this.ctx.bean.user.selectGeneral({ params });
    }

    async forward({ flowTaskId, handle, user }) {
      return await this.ctx.bean.flowTask.forward({ flowTaskId, handle, user });
    }

    async forwardRecall({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.forwardRecall({ flowTaskId, user });
    }

    async userSelectSubstitute({ flowTaskId, params, user }) {
      // check right
      const flowTask = await this.ctx.model.flowTask.get({ id: flowTaskId });
      await this.ctx.bean.local.right.substitute({ flowTask, user });
      // users
      return await this.ctx.bean.user.selectGeneral({ params });
    }

    async substitute({ flowTaskId, handle, user }) {
      return await this.ctx.bean.flowTask.substitute({ flowTaskId, handle, user });
    }

    async substituteRecall({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.substituteRecall({ flowTaskId, user });
    }
  }
  return FlowTask;
};


/***/ }),

/***/ 7214:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const flow = __webpack_require__(4934);
const flowTask = __webpack_require__(3199);

module.exports = app => {
  const services = {
    flow,
    flowTask,
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