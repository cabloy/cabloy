module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _appendHandleRemark({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTaskHistory;
      // check right
      await this.localRight.appendHandleRemark({ flowTask, user, nodeDef: this.contextTask._nodeDef });
      // only update flowTaskHistory
      this.contextTask._flowTaskHistory.handleRemark = handle.remark;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
    }
  }
  return FlowTask;
};
