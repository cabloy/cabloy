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
      const tasks = await ctx.bean.flowTask.select({
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
      // loop
      for (const task of tasks) {
        // actions
        if (task.userIdAssignee === user.id && !flowOld) {
          task._actions = await this._flowData_task_actions({ nodeInstances, task, user });
        }
      }
      return tasks;
    }

    async _flowData_task_actions({ nodeInstances, task, user }) {
      // info
      const isDone = task.flowTaskStatus === 1;
      // actions
      const actions = [];
      // 1. assigneesConfirmation
      if (!isDone && task.specificFlag === 1) {
        actions.push({
          name: 'assigneesConfirmation',
        });
        // only one action
        return actions;
      }
      // 2. recall
      if (!isDone && task.specificFlag === 2) {
        actions.push({
          name: 'recall',
        });
        // only one action
        return actions;
      }
      // 3. handleTask
      // 4. cancelFlow
      if (!isDone) {
        const options = await nodeInstances.getOptions(task.flowNodeId);
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
      // 5. viewAtom
      actions.push({
        name: 'viewAtom',
      });
      // 6. appendHandleRemark
      if (task.flowNodeType === 'startEventAtom' && isDone && !task.handleRemark) {
        actions.push({
          name: 'appendHandleRemark',
        });
      }
      // 7. allowForward
      if (!isDone) {
        const options = await nodeInstances.getOptions(task.flowNodeId);
        // allowForward
        if (options.allowForward) {
          // check if has forwarded
          if (!task.userIdForwardTo) {
          }
          // check if has forwanded and not claimed
        }
      }
      // 8. allowSubstitute
      // ok
      return actions;
    }
  }
  return FlowTask;
};
