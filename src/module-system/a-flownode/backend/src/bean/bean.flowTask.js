module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {

    get modelFlowTask() {
      return ctx.model.module(moduleInfo.relativeName).flowTask;
    }
    get modelFlowTaskHistory() {
      return ctx.model.module(moduleInfo.relativeName).flowTaskHistory;
    }

    get sqlProcedure() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.procedure');
    }

    async count({ options, user }) {
      return await this.select({ options, user, count: 1 });
    }

    async select({ options, user, pageForce = true, count = 0 }) {
      return await this._list({ options, user, pageForce, count });
    }

    async claim({ flowTaskId, user }) {
      // get
      const flowTask = await this.modelFlowTask.get({ id: flowTaskId });
      if (!flowTask) ctx.throw.module(moduleInfo.relativeName, 1001);
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002);
      // check
      if (flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1003);
      // timeClaimed
      const timeClaimed = new Date();
      await this.modelFlowTask.update({ id: flowTaskId, timeClaimed });
      // history
      const flowTaskHistory = await this.modelFlowTaskHistory.get({ flowTaskId });
      await this.modelFlowTaskHistory.update({ id: flowTaskHistory.id, timeClaimed });
    }

    async complete({ flowTaskId, handle, formAtom, user }) {
      // get
      const flowTask = await this.modelFlowTask.get({ id: flowTaskId });
      if (!flowTask) ctx.throw.module(moduleInfo.relativeName, 1001);
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002);
      // timeClaimed first
      if (!flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1004);
      // formAtom
      await this._complete_formAtom({ flowTaskId, formAtom });
      // handle
      await this._complete_handle({ flowTaskId, handle });
      // go to the stage: end

    }

    async _complete_formAtom({ flowTaskId, formAtom }) {
      if (!formAtom) return;
      // todo:
    }

    async _complete_handle({ flowTaskId, handle }) {
      const timeHandled = new Date();
      const data = {
        flowTaskStatus: 1,
        timeHandled,
      };
      if (handle) {
        data.handleStatus = handle.status;
        data.handleRemark = handle.remark;
      }
      await this.modelFlowTask.update({
        id: flowTaskId,
        ...data,
      });
      // history
      const flowTaskHistory = await this.modelFlowTaskHistory.get({ flowTaskId });
      await this.modelFlowTaskHistory.update({
        id: flowTaskHistory.id,
        ...data,
      });
    }

    async _list({ options: { where, orders, page, history = 0 }, user, pageForce = true, count = 0 }) {
      page = ctx.bean.util.page(page, pageForce);
      const sql = this.sqlProcedure.selectTasks({
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
        where, orders, page,
        count,
        history,
      });
      const res = await ctx.model.query(sql);
      return count ? res[0]._count : res;
    }

    async _createTaskInstance({ nodeInstance, userIdAssignee }) {
      const task = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.task`, {
        nodeInstance,
      });
      await task.init({ userIdAssignee });
      return task;
    }

  }

  return FlowTask;
};
