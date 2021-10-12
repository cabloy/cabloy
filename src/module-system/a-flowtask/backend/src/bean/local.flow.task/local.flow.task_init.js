const VarsFn = require('../../common/vars.js');
const UtilsFn = require('../../common/utils.js');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async init({ userIdAssignee, user }) {
      // create flowTask
      const flowTaskId = await this._createFlowTask({ userIdAssignee, user });
      // context init
      await this._contextInit({ flowTaskId, user });
      // event
      await this.raiseEventCreated();
    }

    async _load({ flowTask, user, history }) {
      // context init
      await this._contextInit({ flowTaskId: flowTask.id, user, history });
    }

    async _createFlowTask({ userIdAssignee, user }) {
      // flowTask
      const data = {
        flowId: this.context._flowId,
        flowNodeId: this.contextNode._flowNodeId,
        flowTaskStatus: 0,
        userIdAssignee,
        specificFlag: 0,
        taskVars: '{}',
      };
      const res = await this.modelFlowTask.insert(data);
      const flowTaskId = res.insertId;
      // flowTaskHistory
      data.flowTaskId = flowTaskId;
      await this.modelFlowTaskHistory.insert(data);
      // notify
      this._notifyTaskClaimings(userIdAssignee);
      // publish uniform message
      if (userIdAssignee !== user.id) {
        const userFlow = await ctx.bean.user.get({ id: this.context._flow.flowUserId });
        const userAssignee = await ctx.bean.user.get({ id: userIdAssignee });
        const title = `${ctx.text.locale(userAssignee.locale, 'Task')} - ${ctx.text.locale(
          userAssignee.locale,
          this.contextNode._flowNode.flowNodeName
        )}`;
        const actionPath = `/a/flowtask/flow?flowId=${this.context._flowId}&flowTaskId=${flowTaskId}`;
        const message = {
          userIdTo: userIdAssignee,
          content: {
            issuerId: userFlow.id,
            issuerName: userFlow.userName,
            issuerAvatar: userFlow.avatar,
            title,
            body: this.context._flow.flowName,
            actionPath,
            params: {
              flowId: this.context._flowId,
              flowTaskId,
            },
          },
        };
        // jump out of the transaction
        ctx.tail(async () => {
          await ctx.bean.io.publish({
            message,
            messageClass: {
              module: 'a-flow',
              messageClassName: 'workflow',
            },
          });
        });
      }
      // ok
      return flowTaskId;
    }

    async _contextInit({ flowTaskId, user, history }) {
      // flowTaskId
      this.contextTask._flowTaskId = flowTaskId;
      // flowTask
      if (!history) {
        this.contextTask._flowTask = await this.modelFlowTask.get({ id: flowTaskId });
      }
      this.contextTask._flowTaskHistory = await this.modelFlowTaskHistory.get({ flowTaskId });
      // taskVars
      this.contextTask._taskVars = new (VarsFn())();
      this.contextTask._taskVars._vars = this.contextTask._flowTaskHistory.taskVars
        ? JSON.parse(this.contextTask._flowTaskHistory.taskVars)
        : {};
      // utils
      this.contextTask._utils = new (UtilsFn({ ctx, flowInstance: this.flowInstance }))({
        context: this.context,
        contextNode: this.contextNode,
        contextTask: this.contextTask,
      });
      // user
      this.contextTask._user = user;
    }

    async _hidden({ hidden }) {
      // flowTask
      const flowTaskHidden = hidden ? 1 : 0;
      this.contextTask._flowTask.flowTaskHidden = flowTaskHidden;
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // history
      this.contextTask._flowTaskHistory.flowTaskHidden = flowTaskHidden;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
    }

    _getNodeOptionsTask() {
      return ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
    }
  }
  return FlowTask;
};
