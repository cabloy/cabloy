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

  }

  return FlowTask;
};
