module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Right {
    _check_specificFlag_normal({ flowTask }) {
      if (flowTask.specificFlag === 1 || flowTask.specificFlag === 2) ctx.throw(403);
    }
    _check_specificFlag_0({ flowTask }) {
      if (flowTask.specificFlag !== 0) ctx.throw(403);
    }
    _check_specificFlag_1({ flowTask }) {
      if (flowTask.specificFlag !== 1) ctx.throw(403);
    }
    _check_specificFlag_2({ flowTask }) {
      if (flowTask.specificFlag !== 2) ctx.throw(403);
    }
    _check_sameUser({ flowTask, user }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) {
        ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      }
    }
    _check_notDone({ flowTask }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // not complete
      if (flowTask.flowTaskStatus === 1) {
        ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      }
    }
    _check_claimed({ flowTask }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // timeClaimed first
      if (!flowTask.timeClaimed) {
        ctx.throw.module(moduleInfo.relativeName, 1004, flowTaskId);
      }
    }
    async _getNodeOptions({ getOptions, flowTask, nodeInstance }) {
      if (getOptions) return await getOptions();
      if (!nodeInstance) {
        nodeInstance = await ctx.bean.flow._loadFlowNodeInstance({ flowNodeId: flowTask.flowNodeId });
      }
      return ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance });
    }
    async appendHandleRemark({ flowTask, user, flowNodeType }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // more check
      if (flowNodeType !== 'startEventAtom' || flowTask.flowTaskStatus !== 1 || flowTask.handleRemark) {
        ctx.throw.module(moduleInfo.relativeName, 1011, flowTaskId);
      }
    }
    async assignees({ flowTask, user }) {
      // specificFlag must be 1
      this._check_specificFlag_1({ flowTask });
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDone({ flowTask });
      // timeClaimed first
      this._check_claimed({ flowTask });
    }
    async assigneesConfirmation({ flowTask, user }) {
      // same as assignees
      return await this.assignees({ flowTask, user });
    }
    async cancelFlow({ flowTask, user, getOptions }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // specificFlag must be normal
      this._check_specificFlag_normal({ flowTask });
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDone({ flowTask });
      // check if forward/substitute
      if (flowTask.flowTaskIdForwardTo || flowTask.flowTaskIdSubstituteTo) {
        ctx.throw(403);
      }
      // options
      const options = await this._getNodeOptions({ getOptions, flowTask });
      // check if allowCancelFlow
      if (!options.allowCancelFlow) {
        ctx.throw.module(moduleInfo.relativeName, 1010, flowTaskId);
      }
    }
    async claim({ flowTask, user }) {
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDone({ flowTask });
      // check: not throw error
      // if (flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1003, flowTaskId);
      if (flowTask.timeClaimed) {
        return { timeClaimed: flowTask.timeClaimed };
      }
    }
    async complete({ flowTask, user, handle, getOptions }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // specificFlag must be normal
      this._check_specificFlag_normal({ flowTask });
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDone({ flowTask });
      // timeClaimed first
      this._check_claimed({ flowTask });
      // check if forward/substitute
      if (flowTask.flowTaskIdForwardTo || flowTask.flowTaskIdSubstituteTo) {
        ctx.throw(403);
      }
      // check if pass/reject
      if (handle) {
        // options
        const options = await this._getNodeOptions({ getOptions, flowTask });
        if (handle.status === 1 && !options.allowPassTask) {
          ctx.throw.module(moduleInfo.relativeName, 1006, flowTaskId);
        }
        if (handle.status === 2 && !options.allowRejectTask) {
          ctx.throw.module(moduleInfo.relativeName, 1007, flowTaskId);
        }
      }
    }
    async recall({ flowTask, user }) {
      // specificFlag must be 2
      this._check_specificFlag_2({ flowTask });
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDone({ flowTask });
      // timeClaimed first
      this._check_claimed({ flowTask });
    }
    async forward({ flowTask, user, getOptions }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDone({ flowTask });
      // options
      const options = await this._getNodeOptions({ getOptions, flowTask });
      if (!options.allowForward || flowTask.flowTaskIdForwardTo) {
        ctx.throw.module(moduleInfo.relativeName, 1012, flowTaskId);
      }
    }
  }

  return Right;
};
