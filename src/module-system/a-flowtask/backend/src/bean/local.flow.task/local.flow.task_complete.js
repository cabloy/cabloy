module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _complete({ handle, formAtom }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // check right
      await this.localRight.complete({ flowTask, user, handle, getOptions: () => this._getNodeOptions() });
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
      // special for forward
      await this._complete_handle_checkForward();
      // special for substitute
      await this._complete_handle_checkSubstitute();
    }

    async _complete_handle_checkForward() {
      let flowTaskIdForwardFrom = this.contextTask._flowTask.flowTaskIdForwardFrom;
      if (!flowTaskIdForwardFrom) return;
      while (flowTaskIdForwardFrom) {
        const taskFrom = await this.modelFlowTask.get({ id: flowTaskIdForwardFrom });
        await this.modelFlowTask.update({
          id: flowTaskIdForwardFrom,
          flowTaskStatus: 1,
        });
        await this.modelFlowTaskHistory.update(
          {
            flowTaskStatus: 1,
          },
          {
            flowTaskId: flowTaskIdForwardFrom,
          }
        );
        // notify
        this._notifyTaskHandlings(taskFrom.userIdAssignee);
        // next
        flowTaskIdForwardFrom = taskFrom.flowTaskIdForwardFrom;
      }
    }

    async _complete_handle_checkSubstitute() {
      let flowTaskIdSubstituteFrom = this.contextTask._flowTask.flowTaskIdSubstituteFrom;
      if (!flowTaskIdSubstituteFrom) return;
      while (flowTaskIdSubstituteFrom) {
        const taskFrom = await this.modelFlowTask.get({ id: flowTaskIdSubstituteFrom });
        await this.modelFlowTask.update({
          id: flowTaskIdSubstituteFrom,
          flowTaskStatus: 1,
        });
        await this.modelFlowTaskHistory.update(
          {
            flowTaskStatus: 1,
          },
          {
            flowTaskId: flowTaskIdSubstituteFrom,
          }
        );
        // notify
        this._notifyTaskHandlings(taskFrom.userIdAssignee);
        // next
        flowTaskIdSubstituteFrom = taskFrom.flowTaskIdSubstituteFrom;
      }
    }
  }
  return FlowTask;
};
