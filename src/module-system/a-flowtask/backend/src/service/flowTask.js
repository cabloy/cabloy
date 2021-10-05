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

    async appendHandleRemark({ flowTaskId, handle, user }) {
      return await this.ctx.bean.flowTask.appendHandleRemark({ flowTaskId, handle, user });
    }

    async assignees({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.assignees({ flowTaskId, user });
    }

    async assigneesConfirmation({ flowTaskId, handle, user }) {
      return await this.ctx.bean.flowTask.assigneesConfirmation({ flowTaskId, handle, user });
    }

    async recall({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.recall({ flowTaskId, user });
    }

    async cancelFlow({ flowTaskId, handle, user }) {
      return await this.ctx.bean.flowTask.cancelFlow({ flowTaskId, handle, user });
    }

    async viewAtom({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.viewAtom({ flowTaskId, user });
    }

    async editAtom({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.editAtom({ flowTaskId, user });
    }

    async userSelectForward({ flowTaskId, params, user }) {
      // check right
      const flowTask = await this.ctx.model.flowTask.get({ id: flowTaskId });
      await this.ctx.bean.local.right.forward({ flowTask, user });
      // users
      return await this.ctx.bean.user.selectGeneral({ params });
    }

    async forward({ flowTaskId, handle, user }) {
      return await this.ctx.bean.flowTask.forward({ flowTaskId, handle, user });
    }

    async forwardRecall({ flowTaskId, user }) {
      return await this.ctx.bean.flowTask.forwardRecall({ flowTaskId, user });
    }
  }
  return FlowTask;
};
