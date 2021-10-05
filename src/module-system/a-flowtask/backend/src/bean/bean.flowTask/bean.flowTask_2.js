module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _flowData_flow({ flowId, user }) {
      // select flow
      const flow = await ctx.bean.flow.get({ flowId, history: true, user });
      // not throw error
      // if (!flow) ctx.throw(404);
      // ok
      return flow;
    }

    async _flowData_atom({ flowId, atomId }) {
      // only read basic info
      //   a.atomFlowId = {flowId}
      const atom = await ctx.model.queryOne(
        `
        select a.*,a.id as atomId,b.module,b.atomClassName from aAtom a
           left join aAtomClass b on a.atomClassId=b.id
             where a.deleted=0 and a.iid=? and a.id=?
                   and a.atomFlowId=?
        `,
        [ctx.instance.id, atomId, flowId]
      );
      return atom;
    }

    async _flowData_tasks({ flow, atom, flowId, user }) {
      // select tasks
      let tasks = await ctx.bean.flowTask.select({
        options: {
          where: {
            'a.flowId': flowId,
            'b.flowNodeType': ['startEventAtom', 'activityUserTask'],
            __or__: [{ 'a.userIdAssignee': user.id }, { 'a.flowTaskHidden': 0 }],
          },
          orders: [
            ['a.flowNodeId', 'desc'],
            ['a.specificFlag', 'desc'],
            ['a.flowTaskStatus', 'asc'],
          ],
          history: 1,
        },
        user: null,
        pageForce: false,
      });
      // flowOld
      const flowOld = !atom || atom.atomFlowId !== flow.flowId;
      // nodeInstances
      const nodeInstances = {
        _nodeInstances: {},
        _options: {},
        async get(flowNodeId) {
          let nodeInstance = this._nodeInstances[flowNodeId];
          if (!nodeInstance) {
            nodeInstance = await ctx.bean.flow._loadFlowNodeInstance({ flowNodeId });
            this._nodeInstances[flowNodeId] = nodeInstance;
          }
          return nodeInstance;
        },
        async getOptions(flowNodeId) {
          let options = this._options[flowNodeId];
          if (!options) {
            const nodeInstance = await this.get(flowNodeId);
            options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance });
            this._options[flowNodeId] = options;
          }
          return options;
        },
      };
      // filter
      tasks = tasks.filter(task => {
        if ((task.specificFlag === 1 || task.specificFlag === 2) && task.userIdAssignee !== user.id) return false;
        return true;
      });
      // loop
      for (const task of tasks) {
        // actions
        if (task.userIdAssignee === user.id && !flowOld) {
          task._actions = await this._flowData_task_actions({ nodeInstances, tasks, task, user });
        }
      }
      return tasks;
    }

    async _flowData_task_checkRight(fn) {
      try {
        await fn;
        return true;
      } catch (err) {
        return false;
      }
    }

    async _flowData_task_actions({ nodeInstances, tasks, task, user }) {
      // info
      const isDone = task.flowTaskStatus === 1;
      // actions
      const actions = [];
      const flowTask = task;
      let res;
      // 1. assigneesConfirmation
      res = await this._flowData_task_checkRight(this.localRight.assigneesConfirmation({ flowTask, user }));
      if (res) {
        actions.push({
          name: 'assigneesConfirmation',
        });
        // only one action
        return actions;
      }
      // 2. recall
      res = await this._flowData_task_checkRight(this.localRight.recall({ flowTask, user }));
      if (res) {
        actions.push({
          name: 'recall',
        });
        // only one action
        return actions;
      }
      // 3. claim
      if (!isDone && !task.timeClaimed) {
        const options = await nodeInstances.getOptions(task.flowNodeId);
        actions.push({
          name: 'claim',
          options: {
            bidding: options.bidding,
          },
        });
      }
      // 3. handleTask
      res = await this._flowData_task_checkRight(
        this.localRight.complete({
          flowTask,
          user,
          handle: null,
          getOptions: async () => {
            return await nodeInstances.getOptions(task.flowNodeId);
          },
          disableCheckTimeClaimed: true,
        })
      );
      if (res) {
        const options = await nodeInstances.getOptions(task.flowNodeId);
        actions.push({
          name: 'handleTask',
          options: {
            allowPassTask: options.allowPassTask,
            allowRejectTask: options.allowRejectTask,
          },
        });
      }
      // 4. cancelFlow
      res = await this._flowData_task_checkRight(
        this.localRight.cancelFlow({
          flowTask,
          user,
          getOptions: async () => {
            return await nodeInstances.getOptions(task.flowNodeId);
          },
          disableCheckTimeClaimed: true,
        })
      );
      if (res) {
        actions.push({
          name: 'cancelFlow',
        });
      }
      // 5. viewAtom
      actions.push({
        name: 'viewAtom',
      });
      // 6. appendHandleRemark
      res = await this._flowData_task_checkRight(
        this.localRight.appendHandleRemark({ flowTask, user, flowNodeType: task.flowNodeType })
      );
      if (res) {
        actions.push({
          name: 'appendHandleRemark',
        });
      }
      // 7.1 allowForward: forward
      res = await this._flowData_task_checkRight(
        this.localRight.forward({
          flowTask,
          user,
          getOptions: async () => {
            return await nodeInstances.getOptions(task.flowNodeId);
          },
          disableCheckTimeClaimed: true,
        })
      );
      if (res) {
        actions.push({
          name: 'forward',
        });
      }
      // 7.2 allowForward: forwardRecall
      res = await this._flowData_task_checkRight(
        this.localRight.forwardRecall({
          flowTask,
          user,
          getOptions: async () => {
            return await nodeInstances.getOptions(task.flowNodeId);
          },
          getTask: flowTaskIdForwardTo => {
            return tasks.find(item => item.flowTaskId === flowTaskIdForwardTo);
          },
        })
      );
      if (res) {
        actions.push({
          name: 'forwardRecall',
        });
      }
      // 8.1 allowSubstitute: substitute
      res = await this._flowData_task_checkRight(
        this.localRight.substitute({
          flowTask,
          user,
          getOptions: async () => {
            return await nodeInstances.getOptions(task.flowNodeId);
          },
          disableCheckTimeClaimed: true,
        })
      );
      if (res) {
        actions.push({
          name: 'substitute',
        });
      }
      // 8.2 allowSubstitute: substituteRecall
      res = await this._flowData_task_checkRight(
        this.localRight.substituteRecall({
          flowTask,
          user,
          getOptions: async () => {
            return await nodeInstances.getOptions(task.flowNodeId);
          },
          getTask: flowTaskIdSubstituteTo => {
            return tasks.find(item => item.flowTaskId === flowTaskIdSubstituteTo);
          },
        })
      );
      if (res) {
        actions.push({
          name: 'substituteRecall',
        });
      }
      // ok
      return actions;
    }
  }
  return FlowTask;
};
