module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
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
