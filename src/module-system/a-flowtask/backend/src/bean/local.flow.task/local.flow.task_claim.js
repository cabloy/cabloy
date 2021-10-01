module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _claim() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // check right
      const right = await this.localRight.claim({ flowTask, user });
      if (right) return right;
      // flowTask
      const timeClaimed = new Date();
      this.contextTask._flowTask.timeClaimed = timeClaimed;
      this.contextTask._flowTask.flowTaskHidden = 0; // show
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // history
      this.contextTask._flowTaskHistory.timeClaimed = timeClaimed;
      this.contextTask._flowTaskHistory.flowTaskHidden = 0; // show
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // delete recall task: (specificFlag=2)
      const _taskRecall = await ctx.model.queryOne(
        `
          select id,userIdAssignee from aFlowTask
            where iid=? and deleted=0 and flowNodeId=? and specificFlag=2
          `,
        [ctx.instance.id, flowTask.flowNodeId]
      );
      if (_taskRecall) {
        this._notifyTaskHandlings(_taskRecall.userIdAssignee);
        // delete task
        await ctx.model.query(
          `
          delete from aFlowTask
            where iid=? and id=?
          `,
          [ctx.instance.id, _taskRecall.id]
        );
        await ctx.model.query(
          `
          update aFlowTaskHistory set deleted=1
            where iid=? and deleted=0 and flowTaskId=?
          `,
          [ctx.instance.id, _taskRecall.id]
        );
      }
      // check if bidding
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      if (options.bidding) {
        // notify
        const _tasks = await ctx.model.query(
          `
          select id,userIdAssignee from aFlowTask
            where iid=? and deleted=0 and flowNodeId=? and id<>?
          `,
          [ctx.instance.id, flowTask.flowNodeId, flowTaskId]
        );
        for (const _task of _tasks) {
          this._notifyTaskClaimings(_task.userIdAssignee);
        }
        // delete other tasks
        await ctx.model.query(
          `
          delete from aFlowTask
            where iid=? and flowNodeId=? and id<>?
          `,
          [ctx.instance.id, flowTask.flowNodeId, flowTaskId]
        );
        await ctx.model.query(
          `
          update aFlowTaskHistory set deleted=1
            where iid=? and deleted=0 and flowNodeId=? and flowTaskId<>?
          `,
          [ctx.instance.id, flowTask.flowNodeId, flowTaskId]
        );
      }
      // event: task.claimed
      await this.claimed();
      // notify
      this._notifyTaskClaimings(flowTask.userIdAssignee);
      this._notifyTaskHandlings(flowTask.userIdAssignee);
      // ok
      return { timeClaimed };
    }
  }
  return FlowTask;
};
