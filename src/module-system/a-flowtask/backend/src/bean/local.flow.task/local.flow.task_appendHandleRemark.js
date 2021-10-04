module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
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
  }
  return FlowTask;
};
