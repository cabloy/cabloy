module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    get modelFlowTask() {
      return ctx.model.module(moduleInfo.relativeName).flowTask;
    }
    get modelFlowTaskHistory() {
      return ctx.model.module(moduleInfo.relativeName).flowTaskHistory;
    }
    get localRight() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.right');
    }
    get sqlProcedure() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.procedure');
    }

    async count({ options, user }) {
      return await this.select({ options, user, count: 1 });
    }

    async select({ options, user, pageForce = true, count = 0 }) {
      const tasks = await this._list({ options, user, pageForce, count });
      // loop
      for (const task of tasks) {
        // locale
        task.flowNodeNameLocale = ctx.text(task.flowNodeName);
        if (task.flowNodeRemark) {
          task.flowNodeRemarkLocale = ctx.text(task.flowNodeRemark);
        }
        if (task.handleRemark) {
          task.handleRemarkLocale = ctx.text(task.handleRemark);
        }
      }
      return tasks;
    }

    async claim({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      return await taskInstance._claim();
    }

    async complete({ flowTaskId, handle, formAtom, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._complete({ handle, formAtom });
    }

    async appendHandleRemark({ flowTaskId, handle, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user, history: true });
      await taskInstance._appendHandleRemark({ handle });
    }

    async assignees({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      return await taskInstance._assignees();
    }

    async assigneesConfirmation({ flowTaskId, handle, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._assigneesConfirmation({ handle });
    }

    async recall({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._recall();
    }

    async cancelFlow({ flowTaskId, handle, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._cancelFlow({ handle });
    }

    // from history
    async viewAtom({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user, history: true });
      return await taskInstance._viewAtom();
    }

    // from runtime
    async editAtom({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user, history: false });
      return await taskInstance._editAtom();
    }

    async forward({ flowTaskId, handle, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._forward({ handle });
    }

    async forwardRecall({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._forwardRecall();
    }

    async substitute({ flowTaskId, handle, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._substitute({ handle });
    }

    async substituteRecall({ flowTaskId, user }) {
      // taskInstance
      const taskInstance = await this._loadTaskInstance({ flowTaskId, user });
      await taskInstance._substituteRecall();
    }

    async flowData({ flowId, user }) {
      // flow
      const flow = await this._flowData_flow({ flowId, user });
      if (!flow) return null;
      // atom
      const atom = await this._flowData_atom({ flowId, atomId: flow.flowAtomId });
      // tasks
      const tasks = await this._flowData_tasks({ flow, atom, flowId, user });
      // ok
      return { flow, atom, tasks };
    }
  }

  return FlowTask;
};
