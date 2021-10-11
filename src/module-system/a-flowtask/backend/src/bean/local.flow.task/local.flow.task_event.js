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
