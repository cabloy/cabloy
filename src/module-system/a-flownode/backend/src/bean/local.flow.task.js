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
        specificFlag: 0,
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

    async _claim() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // check
      if (flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1003, flowTaskId);
      // flowTask
      const timeClaimed = new Date();
      this.contextTask._flowTask.timeClaimed = timeClaimed;
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // history
      this.contextTask._flowTaskHistory.timeClaimed = timeClaimed;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // event: task.claimed
      await this.claimed();
    }

    async _complete({ handle, formAtom }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // specificFlag must be 0
      if (flowTask.specificFlag !== 0) ctx.throw(403);
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // timeClaimed first
      if (!flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1004, flowTaskId);
      // check handled
      if (flowTask.flowTaskStatus !== 0) ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      // check if pass/reject
      const options = ctx.bean.flowTask._getNodeRefOptionsTask({ nodeInstance: this.nodeInstance });
      if (handle && handle.status === 1 && !options.allowPassTask) {
        ctx.throw.module(moduleInfo.relativeName, 1006, flowTaskId);
      }
      if (handle && handle.status === 2 && !options.allowRejectTask) {
        ctx.throw.module(moduleInfo.relativeName, 1007, flowTaskId);
      }
      // formAtom
      await this._complete_formAtom({ formAtom });
      // handle
      await this._complete_handle({ handle });
      // event: task.completed
      await this.completed();
      // check if node done
      ctx.tail(async () => {
        // ctxParent
        const ctxParent = {
          state: {
            user: {
              op: user,
            },
          },
        };
        // queue
        await ctx.app.meta.queue.pushAsync({
          locale: ctx.locale,
          subdomain: ctx.subdomain,
          module: moduleInfo.relativeName,
          queueName: 'flowCheck',
          queueNameSub: flowTask.flowId,
          ctxParent,
          data: {
            queueAction: 'activityUserTask.checkIfNodeDone',
            flowNodeId: flowTask.flowNodeId,
          },
        });
      });
    }

    async _assigneesConfirmation({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // specificFlag must be 1
      if (flowTask.specificFlag !== 1) ctx.throw(403);
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // timeClaimed first
      if (!flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1004, flowTaskId);
      // check handled
      if (flowTask.flowTaskStatus !== 0) ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      // handle
      await this._assigneesConfirmation_handle({ handle });
    }

    async _assigneesConfirmation_handle({ handle }) {
      const status = handle.status;
      const assignees = handle.assignees;
      // delete flowTask and flowTaskHistory
      const flowTaskId = this.contextTask._flowTaskId;
      await this.modelFlowTask.delete({ id: flowTaskId });
      await this.modelFlowTaskHistory.delete({ flowTaskId });
      // passed
      if (status === 1) {
        if (!assignees || assignees.length === 0) ctx.throw.module(moduleInfo.relativeName, 1009, flowTaskId);
        // save var: _assignees
        this.contextNode.vars.set('_assignees', assignees);
        // next stage of flow node: begin
        return await this.nodeInstance.begin();
      }
      // reject
      if (status === 2) {

      }

    }

    async _complete_formAtom({ formAtom }) {
      if (!formAtom) return;
      // schemaWrite
      const schemaWrite = await this._getSchemaWrite();
      if (!schemaWrite) return;
      // write
      const atomId = this.context._atom.atomId;
      const user = this.contextTask._user;
      await ctx.bean.atom.write({
        key: { atomId }, item: formAtom,
        options: { schema: schemaWrite },
        user,
      });
    }

    async _complete_handle({ handle }) {
      const timeHandled = new Date();
      // flowTask
      this.contextTask._flowTask.flowTaskStatus = 1;
      this.contextTask._flowTask.timeHandled = timeHandled;
      if (handle) {
        this.contextTask._flowTask.handleStatus = handle.status;
        this.contextTask._flowTask.handleRemark = handle.remark;
      }
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // flowTaskHistory
      this.contextTask._flowTaskHistory.flowTaskStatus = 1;
      this.contextTask._flowTaskHistory.timeHandled = timeHandled;
      if (handle) {
        this.contextTask._flowTaskHistory.handleStatus = handle.status;
        this.contextTask._flowTaskHistory.handleRemark = handle.remark;
      }
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
    }

    async _getSchemaWrite() {
      const module = this.context._atom.module;
      // options
      const options = ctx.bean.flowTask._getNodeRefOptionsTask({ nodeInstance: this.nodeInstance });
      const fields = options.schema.write;
      if (!fields || fields.length === 0) return null;
      // base
      let schemaBase = await this._getSchemaBase();
      if (!schemaBase) {
        schemaBase = {
          module,
          schema: { type: 'object', properties: {} },
        };
      }
      const propertiesBase = schemaBase.schema.properties;
      // propertiesWrite
      const propertiesWrite = {};
      for (const field of fields) {
        if (typeof field === 'string') {
          if (propertiesBase[field]) {
            propertiesWrite[field] = propertiesBase[field];
          }
        } else {
          // { name, property }
          propertiesWrite[field.name] = field.property;
        }
      }
      // schemaWrite
      let schemaWrite = {
        module,
        schema: { type: 'object', properties: propertiesWrite },
      };
      // listener
      const res = await this.flowInstance._flowListener.getSchemaWrite(this.contextTask, this.contextNode, { schemaBase, schemaWrite });
      if (res) {
        schemaWrite = res;
      }
      // ok
      return schemaWrite;
    }

    async _getSchemaBase() {
      const atomClassId = this.context._atom.atomClassId;
      const user = this.contextTask._user;
      const schema = await ctx.bean.atom.schema({
        atomClass: { id: atomClassId },
        user,
      });
      return schema;
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
