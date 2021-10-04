module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _assignees() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // check right
      await this.localRight.assignees({ flowTask, user });
      // handle
      return await this._assignees_handle();
    }

    async _assignees_handle() {
      // assignees
      const assignees = this.contextNode.vars.get('_assignees');
      // users
      let users;
      if (!assignees || assignees.length === 0) {
        users = [];
      } else {
        users = await ctx.bean.user.select({
          options: {
            where: {
              'a.disabled': 0,
              'a.id': assignees,
            },
            orders: [['a.userName', 'asc']],
            removePrivacy: true,
          },
        });
      }
      // options
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      // ok
      return {
        users,
        options: {
          confirmationAllowAppend: options.confirmationAllowAppend,
        },
      };
    }

    async _assigneesConfirmation({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      // check right
      await this.localRight.assigneesConfirmation({ flowTask, user });
      // handle
      await this._assigneesConfirmation_handle({ handle });
      // notify
      this._notifyTaskHandlings(flowTask.userIdAssignee);
    }

    async _assigneesConfirmation_handle({ handle }) {
      // options
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      // flowTaskHistory update
      this.contextTask._flowTaskHistory.flowTaskStatus = 1;
      this.contextTask._flowTaskHistory.timeHandled = new Date();
      this.contextTask._flowTaskHistory.handleStatus = handle.status;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // delete flowTask and flowTaskHistory
      const flowTaskId = this.contextTask._flowTaskId;
      await this.modelFlowTask.delete({ id: flowTaskId });
      await this.modelFlowTaskHistory.delete({ flowTaskId });
      // passed
      if (handle.status === 1) {
        // assignees
        const assignees = await this.flowInstance._parseAssignees(handle.assignees);
        if (!assignees || assignees.length === 0) {
          ctx.throw.module(moduleInfo.relativeName, 1008, flowTaskId);
        }
        // check confirmationAllowAppend
        if (!options.confirmationAllowAppend) {
          const assigneesOld = this.contextNode.vars.get('_assignees');
          if (!new Set(assigneesOld).isSuperset(new Set(assignees))) {
            ctx.throw.module(moduleInfo.relativeName, 1009, flowTaskId);
          }
        }
        // save var: _assigneesConfirmation
        this.contextNode.vars.set('_assigneesConfirmation', assignees);
        // next stage of flow node: begin
        return await this.nodeInstance.begin();
      }
      // reject
      if (handle.status === 2) {
        return await ctx.bean.flowTask._gotoFlowNodePrevious({
          nodeInstance: this.nodeInstance,
          rejectedNode: null,
        });
      }
    }
  }
  return FlowTask;
};
