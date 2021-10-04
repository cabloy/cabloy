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

    async init({ userIdAssignee, user }) {
      // create flowTask
      const flowTaskId = await this._createFlowTask({ userIdAssignee, user });
      // context init
      await this._contextInit({ flowTaskId, user });
      // event
      await this.created();
    }

    async _appendHandleRemark({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTaskHistory;
      const flowTaskId = flowTask.id;
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) {
        ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      }
      // more check
      if (
        this.contextTask._nodeDef.type !== 'startEventAtom' ||
        flowTask.flowTaskStatus !== 1 ||
        flowTask.handleRemark
      ) {
        ctx.throw.module(moduleInfo.relativeName, 1011, flowTaskId);
      }
      // only update flowTaskHistory
      this.contextTask._flowTaskHistory.handleRemark = handle.remark;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
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
  }
  return FlowTask;
};
