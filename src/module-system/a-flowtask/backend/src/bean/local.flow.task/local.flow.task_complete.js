module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _complete({ handle, formAtom }) {
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
      // timeClaimed first
      if (!flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1004, flowTaskId);
      // check handled
      if (flowTask.flowTaskStatus !== 0) ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      // check if pass/reject
      if (handle) {
        const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
        if (handle.status === 1 && !options.allowPassTask) {
          ctx.throw.module(moduleInfo.relativeName, 1006, flowTaskId);
        }
        if (handle.status === 2 && !options.allowRejectTask) {
          ctx.throw.module(moduleInfo.relativeName, 1007, flowTaskId);
        }
      }
      // formAtom
      if (formAtom) {
        await this._complete_formAtom({ formAtom });
      }
      // handle
      if (handle) {
        await this._complete_handle({ handle });
        // event: task.completed
        await this.completed();
        // check if node done
        ctx.tail(async () => {
          await this._complete_tail({ flowTask, user });
        });
        // notify
        this._notifyTaskHandlings(flowTask.userIdAssignee);
      }
    }

    async _complete_tail({ flowTask, user }) {
      const flowNodeId = flowTask.flowNodeId;
      await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.flowTask.nodeDoneCheck.${flowNodeId}`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'flowTask',
            context: { flowNodeId },
            fn: '_nodeDoneCheckLock',
            transaction: true,
            ctxParent: { state: { user: { op: user } } },
          });
        },
      });
    }

    async _complete_formAtom({ formAtom }) {
      // schemaWrite
      const schemaWrite = await this._getSchemaWrite();
      if (!schemaWrite) return;
      // write
      const atomId = this.context._atom.atomId;
      const user = this.contextTask._user;
      await ctx.bean.atom.write({
        key: { atomId },
        item: formAtom,
        options: { schema: schemaWrite },
        user,
      });
    }

    async _complete_handle({ handle }) {
      const timeHandled = new Date();
      // flowTask
      this.contextTask._flowTask.flowTaskStatus = 1;
      this.contextTask._flowTask.timeHandled = timeHandled;
      this.contextTask._flowTask.handleStatus = handle.status;
      this.contextTask._flowTask.handleRemark = handle.remark;
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // flowTaskHistory
      this.contextTask._flowTaskHistory.flowTaskStatus = 1;
      this.contextTask._flowTaskHistory.timeHandled = timeHandled;
      this.contextTask._flowTaskHistory.handleStatus = handle.status;
      this.contextTask._flowTaskHistory.handleRemark = handle.remark;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
    }
  }
  return FlowTask;
};
