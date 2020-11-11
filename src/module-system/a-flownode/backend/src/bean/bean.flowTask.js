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
      return await this._list({ options, user, pageForce, count });
    }

    async claim({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._claim();
    }

    async complete({ flowTaskId, handle, formAtom, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._complete({ handle, formAtom });
    }

    async assigneesConfirmation({ flowTaskId, handle, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._assigneesConfirmation({ handle });
    }

    async _checkIfNodeDone({ flowNodeId /* user*/ }) {
      // load flow node
      const nodeInstance = await ctx.bean.flow._loadFlowNodeInstance({ flowNodeId });
      // options
      const options = this._getNodeRefOptionsTask({ nodeInstance });
      // completionCondition
      const completionCondition = options.completionCondition;
      // task count
      const taskCountTotal = await this.modelFlowTask.count({
        flowNodeId,
      });
      if (taskCountTotal === 0) ctx.throw.module('a-flow', 1004, flowNodeId);
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
          return await this._checkIfNodeDone_passed({ nodeInstance });
        }
      } else {
        // percent value
        if (taskCountPassed / taskCountTotal >= parseInt(completionCondition.passed) / 100) {
          return await this._checkIfNodeDone_passed({ nodeInstance });
        }
      }
      // check rejected
      if (typeof completionCondition.rejected === 'number' || completionCondition.rejected.indexOf('%') === -1) {
        // absolute value
        if (taskCountRejected >= parseInt(completionCondition.rejected)) {
          return await this._checkIfNodeDone_rejected({ nodeInstance, options });
        }
      } else {
        // percent value
        if (taskCountRejected / taskCountTotal >= parseInt(completionCondition.rejected) / 100) {
          return await this._checkIfNodeDone_rejected({ nodeInstance, options });
        }
      }
      // here means not done
    }

    async _checkIfNodeDone_passed({ nodeInstance }) {
      // delete tasks
      await this._checkIfNodeDone_deleteTasks({ nodeInstance });
      // next stage of flow node: end
      return await nodeInstance.end();
    }

    async _checkIfNodeDone_rejected({ nodeInstance, options }) {
      // flowNodeId
      const flowNodeId = nodeInstance.contextNode._flowNodeId;
      // delete tasks
      await this._checkIfNodeDone_deleteTasks({ nodeInstance });
      // rejectedNode
      let rejectedNode = options.rejectedNode;
      if (!rejectedNode) {
        // find previous task node
        const flowNode = await this._findFlowNodeHistoryPrevious({ nodeInstance, flowNodeId });
        if (!flowNode) ctx.throw.module('a-flow', 1006, flowNodeId);
        rejectedNode = flowNode.flowNodeDefId;
      }
      // nodeInstancePrev
      const nodeInstancePrev = await nodeInstance.flowInstance._findNodeInstanceNext({
        nodeRefId: rejectedNode,
        flowNodeIdPrev: flowNodeId,
      });
      // clear & enter
      await nodeInstance._clear({ flowNodeRemark: 'Rejected' });
      return await nodeInstancePrev.enter();
    }

    async _findFlowNodeHistoryPrevious({ nodeInstance, flowNodeId }) {
      return await nodeInstance.flowInstance._findFlowNodeHistoryPrevious({
        flowNodeId, cb: ({ /* flowNode*/ nodeRef }) => {
          return nodeRef.type === 'startEventAtom' || nodeRef.type === 'activityUserTask';
        },
      });
    }

    async _checkIfNodeDone_deleteTasks({ nodeInstance }) {
      const flowNodeId = nodeInstance.contextNode._flowNodeId;
      await this.modelFlowTask.delete({ flowNodeId });
    }

    async _list({ options: { where, orders, page, history = 0 }, user, pageForce = true, count = 0 }) {
      page = ctx.bean.util.page(page, pageForce);
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

    async _loadTaskInstance({ flowTaskId, user }) {
      // get
      const flowTask = await this.modelFlowTask.get({ id: flowTaskId });
      if (!flowTask) ctx.throw.module(moduleInfo.relativeName, 1001, flowTaskId);
      // load flow node
      const nodeInstance = await ctx.bean.flow._loadFlowNodeInstance({ flowNodeId: flowTask.flowNodeId });
      // load task
      const task = this._createTaskInstance2({ nodeInstance });
      await task._load({ flowTask, user });
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

    _getNodeRefOptionsTask({ nodeInstance }) {
      // nodeRef
      const nodeRef = nodeInstance.contextNode._nodeRef;
      // options
      const options = nodeInstance.getNodeRefOptions();
      return nodeRef.type === 'startEventAtom' ? options.task : options;
    }

  }

  return FlowTask;
};
