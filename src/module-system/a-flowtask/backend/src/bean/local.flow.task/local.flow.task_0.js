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
    get localRight() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.right');
    }

    async init({ userIdAssignee, user }) {
      // create flowTask
      const flowTaskId = await this._createFlowTask({ userIdAssignee, user });
      // context init
      await this._contextInit({ flowTaskId, user });
      // event
      await this.created();
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

    async _appendHandleRemark({ handle }) {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTaskHistory;
      const flowTaskId = flowTask.id;
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) {
        ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      }
      // more check
      if (
        this.contextTask._nodeDef.type !== 'startEventAtom' ||
        flowTask.flowTaskStatus !== 1 ||
        flowTask.handleRemark
      ) {
        ctx.throw.module(moduleInfo.relativeName, 1011, flowTaskId);
      }
      // only update flowTaskHistory
      this.contextTask._flowTaskHistory.handleRemark = handle.remark;
      await this.modelFlowTaskHistory.update(this.contextTask._flowTaskHistory);
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
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) {
        ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      }
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
            orders: [['a.userName', 'asc']],
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
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) {
        ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      }
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
      const remark = 'Cancelled'; // handle.remark;
      await this.nodeInstance._clear({ flowNodeHandleStatus: 3, flowNodeRemark: remark });
      // end flow
      await this.flowInstance._endFlow({ flowHandleStatus: 3, flowRemark: remark });
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
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) {
        ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      }
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
      const _tasks = await ctx.model.query(
        `
          select id,userIdAssignee from aFlowTask
            where iid=? and deleted=0 and flowNodeId=? and id<>?
          `,
        [ctx.instance.id, flowTask.flowNodeId, flowTaskId]
      );
      for (const _task of _tasks) {
        this._notifyTaskClaimings(_task.userIdAssignee);
      }
      // delete other tasks
      await ctx.model.query(
        `
          delete from aFlowTask
            where iid=? and flowNodeId=? and id<>?
          `,
        [ctx.instance.id, flowTask.flowNodeId, flowTaskId]
      );
      await ctx.model.query(
        `
          update aFlowTaskHistory set deleted=1
            where iid=? and deleted=0 and flowNodeId=? and flowTaskId<>?
          `,
        [ctx.instance.id, flowTask.flowNodeId, flowTaskId]
      );
      // recall
      return await ctx.bean.flowTask._gotoFlowNodePrevious({
        nodeInstance: this.nodeInstance,
        rejectedNode: null,
        flowNodeRemark: 'Recalled',
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
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) {
        ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      }
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
          if (!new Set(assigneesOld).isSuperset(new Set(assignees))) {
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
          nodeInstance: this.nodeInstance,
          rejectedNode: null,
        });
      }
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
  }
  return FlowTask;
};
