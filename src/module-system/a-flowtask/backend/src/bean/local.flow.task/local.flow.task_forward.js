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
      await this.localRight.forward({ flowTask, user, getOptions: () => this._getNodeOptions() });
      // handle
      await this._forward_handle({ handle });
      // notify
      this._notifyTaskHandlings(flowTask.userIdAssignee);
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
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // flowTaskHistory update
      this.contextTask._flowTaskHistory.timeHandled = timeHandled;
      this.contextTask._flowTaskHistory.handleStatus = 4;
      this.contextTask._flowTaskHistory.handleRemark = handle.remark;
      this.contextTask._flowTaskHistory.flowTaskIdForwardTo = flowTaskIdForwardTo;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
    }
  }
  return FlowTask;
};
