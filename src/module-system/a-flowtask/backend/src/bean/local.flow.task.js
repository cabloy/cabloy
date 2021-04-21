const require3 = require('require3');
const extend = require3('extend2');
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
        nodeDef: nodeInstance.contextNode._nodeDef,
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
      const flowTaskId = await this._createFlowTask({ userIdAssignee, user });
      // context init
      await this._contextInit({ flowTaskId, user });
      // event
      await this.created();
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
        const title = `${ctx.text.locale(userAssignee.locale, 'Task')} - ${ctx.text.locale(userAssignee.locale, this.contextNode._flowNode.flowNodeName)}`;
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
      this.contextTask._taskVars._vars = this.contextTask._flowTaskHistory.taskVars ? JSON.parse(this.contextTask._flowTaskHistory.taskVars) : {};
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

    async _claim() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // check: not throw error
      // if (flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1003, flowTaskId);
      if (flowTask.timeClaimed) {
        return { timeClaimed: flowTask.timeClaimed };
      }
      // flowTask
      const timeClaimed = new Date();
      this.contextTask._flowTask.timeClaimed = timeClaimed;
      this.contextTask._flowTask.flowTaskHidden = 0; // show
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // history
      this.contextTask._flowTaskHistory.timeClaimed = timeClaimed;
      this.contextTask._flowTaskHistory.flowTaskHidden = 0; // show
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // delete recall task: (specificFlag=2)
      const _taskRecall = await ctx.model.queryOne(`
          select id,userIdAssignee from aFlowTask
            where iid=? and deleted=0 and flowNodeId=? and specificFlag=2
          `, [ ctx.instance.id, flowTask.flowNodeId ]);
      if (_taskRecall) {
        this._notifyTaskHandlings(_taskRecall.userIdAssignee);
        // delete task
        await ctx.model.query(`
          delete from aFlowTask
            where iid=? and id=?
          `, [ ctx.instance.id, _taskRecall.id ]);
        await ctx.model.query(`
          update aFlowTaskHistory set deleted=1
            where iid=? and deleted=0 and flowTaskId=?
          `, [ ctx.instance.id, _taskRecall.id ]);
      }
      // check if bidding
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      if (options.bidding) {
        // notify
        const _tasks = await ctx.model.query(`
          select id,userIdAssignee from aFlowTask
            where iid=? and deleted=0 and flowNodeId=? and id<>?
          `, [ ctx.instance.id, flowTask.flowNodeId, flowTaskId ]);
        for (const _task of _tasks) {
          this._notifyTaskClaimings(_task.userIdAssignee);
        }
        // delete other tasks
        await ctx.model.query(`
          delete from aFlowTask
            where iid=? and flowNodeId=? and id<>?
          `, [ ctx.instance.id, flowTask.flowNodeId, flowTaskId ]);
        await ctx.model.query(`
          update aFlowTaskHistory set deleted=1
            where iid=? and deleted=0 and flowNodeId=? and flowTaskId<>?
          `, [ ctx.instance.id, flowTask.flowNodeId, flowTaskId ]);
      }
      // event: task.claimed
      await this.claimed();
      // notify
      this._notifyTaskClaimings(flowTask.userIdAssignee);
      this._notifyTaskHandlings(flowTask.userIdAssignee);
      // ok
      return { timeClaimed };
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
      if (handle) {
        const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
        if (handle.status === 1 && !options.allowPassTask) {
          ctx.throw.module(moduleInfo.relativeName, 1006, flowTaskId);
        }
        if (handle.status === 2 && !options.allowRejectTask) {
          ctx.throw.module(moduleInfo.relativeName, 1007, flowTaskId);
        }
      }
      // formAtom
      if (formAtom) {
        await this._complete_formAtom({ formAtom });
      }
      // handle
      if (handle) {
        await this._complete_handle({ handle });
        // event: task.completed
        await this.completed();
        // check if node done
        ctx.tail(async () => {
          await this._complete_tail({ flowTask, user });
        });
        // notify
        this._notifyTaskHandlings(flowTask.userIdAssignee);
      }
    }

    async _complete_tail({ flowTask, user }) {
      const flowNodeId = flowTask.flowNodeId;
      await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.flowTask.nodeDoneCheck.${flowNodeId}`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'flowTask',
            context: { flowNodeId },
            fn: '_nodeDoneCheckLock',
            transaction: true,
            ctxParent: { state: { user: { op: user } } },
          });
        },
      });
    }

    async _assignees() {
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
      return await this._assignees_handle();
    }

    async _assignees_handle() {
      // assignees
      const assignees = this.contextNode.vars.get('_assignees');
      // users
      let users;
      if (!assignees || assignees.length === 0) {
        users = [];
      } else {
        users = await ctx.bean.user.select({
          options: {
            where: {
              'a.disabled': 0,
              'a.id': assignees,
            },
            orders: [[ 'a.userName', 'asc' ]],
            removePrivacy: true,
          },
        });
      }
      // options
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      // ok
      return {
        users,
        options: {
          confirmationAllowAppend: options.confirmationAllowAppend,
        },
      };
    }

    async _cancelFlow({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // specificFlag must be 0
      if (flowTask.specificFlag !== 0) ctx.throw(403);
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // check handled
      if (flowTask.flowTaskStatus !== 0) ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      // check if allowCancelFlow
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      if (!options.allowCancelFlow) {
        ctx.throw.module(moduleInfo.relativeName, 1010, flowTaskId);
      }
      // handle
      await this._cancelFlow_handle({ handle });
    }

    async _cancelFlow_handle({ handle }) {
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // close draft
      const atomId = this.context._flow.flowAtomId;
      if (atomId) {
        await ctx.bean.atom.closeDraft({ key: { atomId } });
      }
      // notify
      this._notifyTaskHandlings(flowTask.userIdAssignee);
      // delete flowTask
      await this.modelFlowTask.delete({ id: flowTaskId });
      // flowTaskHistory update
      this.contextTask._flowTaskHistory.flowTaskStatus = 1;
      this.contextTask._flowTaskHistory.timeHandled = new Date();
      this.contextTask._flowTaskHistory.handleStatus = 3;
      this.contextTask._flowTaskHistory.handleRemark = handle.remark;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // node clear
      //    not use handle.remark
      const remark = 'Cancelled';// handle.remark;
      await this.nodeInstance._clear({ flowNodeHandleStatus: 3, flowNodeRemark: remark });
      // end flow
      await this.flowInstance._endFlow({ flowRemark: remark });
    }

    async _recall() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // specificFlag must be 2
      if (flowTask.specificFlag !== 2) ctx.throw(403);
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // timeClaimed first
      if (!flowTask.timeClaimed) ctx.throw.module(moduleInfo.relativeName, 1004, flowTaskId);
      // check handled
      if (flowTask.flowTaskStatus !== 0) ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      // handle
      await this._recall_handle();
      // notify
      this._notifyTaskHandlings(flowTask.userIdAssignee);
    }

    async _recall_handle() {
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // flowTaskHistory update
      this.contextTask._flowTaskHistory.flowTaskStatus = 1;
      this.contextTask._flowTaskHistory.timeHandled = new Date();
      this.contextTask._flowTaskHistory.handleStatus = 1;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // delete flowTask and flowTaskHistory
      await this.modelFlowTask.delete({ id: flowTaskId });
      await this.modelFlowTaskHistory.delete({ flowTaskId });
      // notify
      const _tasks = await ctx.model.query(`
          select id,userIdAssignee from aFlowTask
            where iid=? and deleted=0 and flowNodeId=? and id<>?
          `, [ ctx.instance.id, flowTask.flowNodeId, flowTaskId ]);
      for (const _task of _tasks) {
        this._notifyTaskClaimings(_task.userIdAssignee);
      }
      // delete other tasks
      await ctx.model.query(`
          delete from aFlowTask
            where iid=? and flowNodeId=? and id<>?
          `, [ ctx.instance.id, flowTask.flowNodeId, flowTaskId ]);
      await ctx.model.query(`
          update aFlowTaskHistory set deleted=1
            where iid=? and deleted=0 and flowNodeId=? and flowTaskId<>?
          `, [ ctx.instance.id, flowTask.flowNodeId, flowTaskId ]);
      // recall
      return await ctx.bean.flowTask._gotoFlowNodePrevious({
        nodeInstance: this.nodeInstance, rejectedNode: null, flowNodeRemark: 'Recalled',
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
      // notify
      this._notifyTaskHandlings(flowTask.userIdAssignee);
    }

    async _assigneesConfirmation_handle({ handle }) {
      // options
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      // flowTaskHistory update
      this.contextTask._flowTaskHistory.flowTaskStatus = 1;
      this.contextTask._flowTaskHistory.timeHandled = new Date();
      this.contextTask._flowTaskHistory.handleStatus = handle.status;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
      // delete flowTask and flowTaskHistory
      const flowTaskId = this.contextTask._flowTaskId;
      await this.modelFlowTask.delete({ id: flowTaskId });
      await this.modelFlowTaskHistory.delete({ flowTaskId });
      // passed
      if (handle.status === 1) {
        // assignees
        const assignees = await this.flowInstance._parseAssignees(handle.assignees);
        if (!assignees || assignees.length === 0) {
          ctx.throw.module(moduleInfo.relativeName, 1008, flowTaskId);
        }
        // check confirmationAllowAppend
        if (!options.confirmationAllowAppend) {
          const assigneesOld = this.contextNode.vars.get('_assignees');
          if (!(new Set(assigneesOld)).isSuperset(new Set(assignees))) {
            ctx.throw.module(moduleInfo.relativeName, 1009, flowTaskId);
          }
        }
        // save var: _assigneesConfirmation
        this.contextNode.vars.set('_assigneesConfirmation', assignees);
        // next stage of flow node: begin
        return await this.nodeInstance.begin();
      }
      // reject
      if (handle.status === 2) {
        return await ctx.bean.flowTask._gotoFlowNodePrevious({
          nodeInstance: this.nodeInstance, rejectedNode: null,
        });
      }
    }

    async _complete_formAtom({ formAtom }) {
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
      this.contextTask._flowTask.handleStatus = handle.status;
      this.contextTask._flowTask.handleRemark = handle.remark;
      await this.modelFlowTask.update(this.contextTask._flowTask);
      // flowTaskHistory
      this.contextTask._flowTaskHistory.flowTaskStatus = 1;
      this.contextTask._flowTaskHistory.timeHandled = timeHandled;
      this.contextTask._flowTaskHistory.handleStatus = handle.status;
      this.contextTask._flowTaskHistory.handleRemark = handle.remark;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
    }

    async _actions() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask;
      const flowTaskId = flowTask.id;
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // flowTaskStatus
      if (flowTask.flowTaskStatus === 1) return null;
      // actions
      const actions = [];
      // specificFlag
      if (flowTask.specificFlag === 1) {
        actions.push({
          name: 'assigneesConfirmation',
        });
      } else if (flowTask.specificFlag === 2) {
        actions.push({
          name: 'recall',
        });
      } else if (flowTask.specificFlag === 0) {
        // options
        const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
        // allowPassTask allowRejectTask
        if (options.allowPassTask || options.allowRejectTask) {
          actions.push({
            name: 'handleTask',
            options: {
              allowPassTask: options.allowPassTask,
              allowRejectTask: options.allowRejectTask,
            },
          });
        }
        // allowCancelFlow
        if (options.allowCancelFlow) {
          actions.push({
            name: 'cancelFlow',
          });
        }
      }
      // others
      return actions;
    }

    async _viewAtom() {
      return await this._getAtomAndSchema({ mode: 'read' });
    }

    async _editAtom() {
      return await this._getAtomAndSchema({ mode: 'write' });
    }

    async _getAtomAndSchema({ mode }) {
      // user/atom
      const user = this.contextTask._user;
      const atom = this.context._atom;
      // flowTask
      const flowTask = this.contextTask._flowTaskHistory;
      const flowTaskId = flowTask.flowTaskId;
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      // must be the same flowId, means not outdated
      if (atom.atomFlowId !== this.context._flowId) ctx.throw.module('a-flow', 1009, this.context._flowId);
      // special for write
      if (mode === 'write') {
        // check handled
        if (flowTask.flowTaskStatus !== 0) ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      }
      // schema
      let schema = await this._getSchema({ mode });
      if (!schema) return null;
      // item
      const item = extend(true, {}, atom);
      // validate
      await ctx.bean.validation._validate({
        data: item,
        options: { schema },
      });
      // get real schema
      schema = ctx.bean.validation.getSchema(schema);
      // basic fields
      const fields = await ctx.bean.atom.modelAtom.columns();
      fields.atomId = {};
      fields.module = {};
      fields.atomClassName = {};
      fields.atomCategoryName = {};
      for (const field in fields) {
        item[field] = atom[field];
      }
      // ok
      return { schema, item };
    }

    async _getSchemaRead() {
      return await this._getSchema({ mode: 'read' });
    }

    async _getSchemaWrite() {
      return await this._getSchema({ mode: 'write' });
    }

    // mode: read/write
    async _getSchema({ mode }) {
      const module = this.context._atom.module;
      // options
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      const fields = options.schema && options.schema[mode];
      if (!fields) return null;
      // { module, validator, schema }
      if (fields && !Array.isArray(fields) && typeof fields === 'object') {
        return {
          module: fields.module,
          validator: fields.validator,
          schema: fields.schema,
        };
      }
      // base
      let schemaBase = await this._getSchemaBase();
      // full read/write
      if (fields === true && schemaBase) {
        return {
          module: schemaBase.module,
          validator: schemaBase.validator,
        };
      }
      if (!schemaBase) {
        schemaBase = {
          module,
          schema: { type: 'object', properties: {} },
        };
      }
      // some fields
      const propertiesBase = schemaBase.schema.properties;
      // properties
      const properties = {};
      for (const field of fields) {
        if (typeof field === 'string') {
          if (propertiesBase[field]) {
            properties[field] = propertiesBase[field];
          }
        } else {
          // { name, property }
          properties[field.name] = field.property;
        }
      }
      // schema
      let schema = {
        module,
        schema: { type: 'object', properties },
      };
      // listener
      const methodName = `getSchema${mode.replace(mode[0], mode[0].toUpperCase())}`;
      const res = await this.flowInstance._flowListener[methodName](this.contextTask, this.contextNode, { schemaBase, schema });
      if (res) {
        schema = res;
      }
      // ok
      return schema;
    }

    async _getSchemaBase() {
      const atomClassId = this.context._atom.atomClassId;
      const schema = await ctx.bean.atom.schema({
        atomClass: { id: atomClassId },
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

    _notifyTaskClaimings(userId) {
      ctx.bean.flowTask._notifyTaskClaimings(userId);
    }

    _notifyTaskHandlings(userId) {
      ctx.bean.flowTask._notifyTaskHandlings(userId);
    }

  }
  return FlowTask;
};
