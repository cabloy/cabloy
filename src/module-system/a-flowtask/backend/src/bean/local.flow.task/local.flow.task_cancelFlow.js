module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _cancelFlow({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // check right
      await this.localRight.cancelFlow({ flowTask, user, getOptions: () => this._getNodeOptions() });
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
