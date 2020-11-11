module.exports = app => {

  class FlowTask extends app.Service {

    async select({ options, user }) {
      return await this.ctx.bean.flowTask.select({ options, user });
    }

    async count({ options, user }) {
      return await this.ctx.bean.flowTask.count({ options, user });
    }

    async claim({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.claim({ flowTaskId, user });
    }

    async complete({ flowTaskId, handle, formAtom, user }) {
      return await this.ctx.bean.flowTask.complete({ flowTaskId, handle, formAtom, user });
    }

    async assigneesConfirmation({ flowTaskId, handle, user }) {
      return await this.ctx.bean.flowTask.assigneesConfirmation({ flowTaskId, handle, user });
    }

  }
  return FlowTask;
};

