const VarsFn = require('../common/vars.js');
const UtilsFn = require('../common/utils.js');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    constructor({ nodeInstance }) {
      this.nodeInstance = nodeInstance;
      this.flowInstance = nodeInstance.flowInstance;
      this.context = nodeInstance.context;
      this.contextNode = nodeInstance.contextNode;
      // context
      this.contextTask = ctx.bean._newBean(`${moduleInfo.relativeName}.local.context.task`, {
        context: nodeInstance.context,
        contextNode: nodeInstance.contextNode,
        nodeRef: nodeInstance.contextNode._nodeRef,
      });
    }

    get modelFlowTask() {
      return ctx.model.module(moduleInfo.relativeName).flowTask;
    }
    get modelFlowTaskHistory() {
      return ctx.model.module(moduleInfo.relativeName).flowTaskHistory;
    }

    async init({ userIdAssignee, user }) {
      // create flowTask
      const flowTaskId = await this._createFlowTask({ userIdAssignee });
      // context init
      await this._contextInit({ flowTaskId, user });
      // event
      await this.created();
    }

    async _load({ flowTask, user }) {
      // context init
      await this._contextInit({ flowTaskId: flowTask.id, user });
    }

    async _createFlowTask({ userIdAssignee }) {
      // flowTask
      const data = {
        flowId: this.context._flowId,
        flowNodeId: this.contextNode._flowNodeId,
        flowTaskStatus: 0,
        userIdAssignee,
        taskVars: '{}',
      };
      const res = await this.modelFlowTask.insert(data);
      const flowTaskId = res.insertId;
      // flowTaskHistory
      data.flowTaskId = flowTaskId;
      await this.modelFlowTaskHistory.insert(data);
      // ok
      return flowTaskId;
    }

    async _contextInit({ flowTaskId, user }) {
      // flowTaskId
      this.contextTask._flowTaskId = flowTaskId;
      // flowTask
      this.contextTask._flowTask = await this.modelFlowTask.get({ id: flowTaskId });
      this.contextTask._flowTaskHistory = await this.modelFlowTaskHistory.get({ flowTaskId });
      // taskVars
      this.contextTask._taskVars = new (VarsFn())();
      this.contextTask._taskVars._vars = this.contextTask._flowTask.taskVars ? JSON.parse(this.contextTask._flowTask.taskVars) : {};
      // utils
      this.contextTask._utils = new (UtilsFn({ ctx, flowInstance: this.flowInstance }))({
        context: this.context,
        contextNode: this.contextNode,
        contextTask: this.contextTask,
      });
      // user
      this.contextTask._user = user;
    }

    async _saveTaskVars() {
      if (!this.contextTask._taskVars._dirty) return;
      // flowTask
      this.contextTask._flowTask.taskVars = JSON.stringify(this.contextTask._taskVars._vars);
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // flowTask history
      this.contextTask._flowTaskHistory.taskVars = this.contextTask._flowTask.taskVars;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // done
      this.contextTask._taskVars._dirty = false;
    }

    async _saveVars() {
      // save taskVars
      await this._saveTaskVars();
      // save nodeVars
      await this.nodeInstance._saveNodeVars();
      // save flowVars
      await this.flowInstance._saveFlowVars();
    }

    async created() {
      // raise event: onTaskCreated
      await this.flowInstance._flowListener.onTaskCreated(this.contextTask, this.contextNode);
      await this._saveVars();
    }

    async claimed() {
      // raise event: onTaskClaimed
      await this.flowInstance._flowListener.onTaskClaimed(this.contextTask, this.contextNode);
      await this._saveVars();
    }

    async completed() {
      // raise event: onTaskCompleted
      await this.flowInstance._flowListener.onTaskCompleted(this.contextTask, this.contextNode);
      await this._saveVars();
    }

  }
  return FlowTask;
};
