module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Right {
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
    async _getNodeOptions({ flowTask, nodeInstance }) {
      if (!nodeInstance) {
        nodeInstance = await ctx.bean.flow._loadFlowNodeInstance({ flowNodeId: flowTask.flowNodeId });
      }
      return ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance });
    }
    async appendHandleRemark({ flowTask, user, nodeDef }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // more check
      if (nodeDef.type !== 'startEventAtom' || flowTask.flowTaskStatus !== 1 || flowTask.handleRemark) {
        ctx.throw.module(moduleInfo.relativeName, 1011, flowTaskId);
      }
    }
    async assignees({ flowTask, user }) {
      // specificFlag must be 1
      if (flowTask.specificFlag !== 1) ctx.throw(403);
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
    async forward({ flowTask, user, nodeInstance }) {
      const flowTaskId = flowTask.flowTaskId || flowTask.id;
      // must be the same user
      this._check_sameUser({ flowTask, user });
      // not complete
      this._check_notDone({ flowTask });
      // options
      const options = await this._getNodeOptions({ flowTask, nodeInstance });
      if (!options.allowForward || flowTask.userIdForwardTo) {
        ctx.throw.module(moduleInfo.relativeName, 1012, flowTaskId);
      }
    }
  }

  return Right;
};
