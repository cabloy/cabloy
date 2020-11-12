const require3 = require('require3');
const assert = require3('assert');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowNodeActivityUserTaskBase extends ctx.app.meta.FlowNodeBase {
    constructor(options) {
      super(ctx, options);
    }

    async onNodeEnter() {
      // super
      await super.onNodeEnter();

      // options
      const options = ctx.bean.flowTask._getNodeRefOptionsTask({
        nodeInstance: this.nodeInstance,
      });

      // prepare assignees
      const res = await this._prepareAssignees({ options });
      if (!res) return false;

      // ok
      return true;
    }

    async onNodeBegin() {
      // super
      await super.onNodeBegin();

      // user
      const user = this.flowInstance._getOpUser();

      // var: _assigneesConfirmation
      const assignees = this.contextNode.vars.get('_assigneesConfirmation');
      assert(assignees && assignees.length > 0);

      // create tasks
      for (const userIdAssignee of assignees) {
        await ctx.bean.flowTask._createTaskInstance({
          nodeInstance: this.nodeInstance,
          userIdAssignee,
          user,
        });
      }

      // ok
      return true;
    }

    async onNodeDoing() {
      // super
      await super.onNodeDoing();

      // check if the first node
      if (this.contextNode._flowNode.flowNodeIdPrev !== 0) {
        // break
        return false;
      }

      // auto complete
      await this._autoCompleteTask();

      // break
      return false;
    }

    async _autoCompleteTask() {
      const flowId = this.context._flowId;
      // select
      const tasks = await ctx.bean.flowTask.select({
        options: {
          where: {
            'a.flowId': flowId,
            'a.flowTaskStatus': 0,
          },
          history: 0,
        } });
      const task = tasks[0];
      const flowTaskId = task.id;
      const user = { id: task.userIdAssignee };
      // claim
      await ctx.bean.flowTask.claim({ flowTaskId, user });
      // complete
      await ctx.bean.flowTask.complete({
        flowTaskId,
        handle: { status: 1 },
        user,
      });
    }

    async _prepareAssignees({ options }) {
      // check var: _assigneesConfirmation
      let assignees = this.contextNode.vars.get('_assigneesConfirmation');
      if (assignees && assignees.length > 0) return true;

      // check var: _assignees
      this.contextNode.vars.get('_assignees');
      if (!assignees || assignees.length === 0) {
        // assignees
        assignees = await this.flowInstance._parseAssignees(options.assignees);
      }

      // confirmation
      if (assignees.length === 0 || options.confirmation) {
        // save var: _assignees
        this.contextNode.vars.set('_assignees', assignees);
        // user
        const user = this.flowInstance._getOpUser();
        const taskInstance = await ctx.bean.flowTask._createTaskInstance({
          nodeInstance: this.nodeInstance,
          userIdAssignee: user.id,
          user,
        });
        await this._taskConfirmationClaim({ taskInstance });
        // break
        return false;
      }

      // save var: _assigneesConfirmation
      this.contextNode.vars.set('_assigneesConfirmation', assignees);

      // ok
      return true;
    }

    async _taskConfirmationClaim({ taskInstance }) {
      // specificFlag timeClaimed
      const specificFlag = 1;
      const timeClaimed = new Date();
      taskInstance.contextTask._flowTask.specificFlag = specificFlag;
      taskInstance.contextTask._flowTask.timeClaimed = timeClaimed;
      await taskInstance.modelFlowTask.update(taskInstance.contextTask._flowTask);
      // history
      taskInstance.contextTask._flowTaskHistory.specificFlag = specificFlag;
      taskInstance.contextTask._flowTaskHistory.timeClaimed = timeClaimed;
      await taskInstance.modelFlowTaskHistory.update(taskInstance.contextTask._flowTaskHistory);
    }

  }
  return FlowNodeActivityUserTaskBase;
};
