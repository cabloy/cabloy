module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _cancelFlow({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // specificFlag must be 0
      if (flowTask.specificFlag !== 0) ctx.throw(403);
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) {
        ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      }
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
      const remark = 'Cancelled'; // handle.remark;
      await this.nodeInstance._clear({ flowNodeHandleStatus: 3, flowNodeRemark: remark });
      // end flow
      await this.flowInstance._endFlow({ flowHandleStatus: 3, flowRemark: remark });
    }
  }
  return FlowTask;
};
