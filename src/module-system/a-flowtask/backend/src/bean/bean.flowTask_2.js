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
      // flowOld
      const flowOld = !atom || atom.atomFlowId !== flow.flowId;
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
      // loop
      for (const task of tasks) {
        // actions
        if (task.userIdAssignee === user.id && !flowOld) {
          task._actions = await ctx.bean.flowTask.actions({
            flowTaskId: task.flowTaskId,
            user,
            history: task.flowTaskStatus === 1,
          });
        }
      }
      return tasks;
    }

    async _flowData_task_actions() {
      // user
      const user = this.contextTask._user;
      // flowTask
      const flowTask = this.contextTask._flowTask || this.contextTask._flowTaskHistory;
      const flowTaskId = flowTask.id;
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) {
        return ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      }
      // info
      const isDone = flowTask.flowTaskStatus === 1;
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      // actions
      const actions = [];
      // 1. assigneesConfirmation
      if (!isDone && flowTask.specificFlag === 1) {
        actions.push({
          name: 'assigneesConfirmation',
        });
      }
      // 2. recall
      if (!isDone && flowTask.specificFlag === 2) {
        actions.push({
          name: 'recall',
        });
      }
      // 3. handleTask
      // 4. cancelFlow
      if (!isDone && flowTask.specificFlag === 0) {
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
      if (flowTask.specificFlag === 0) {
        actions.push({
          name: 'viewAtom',
        });
      }
      // 6. appendHandleRemark
      if (this.contextTask._nodeDef.type === 'startEventAtom' && isDone && !flowTask.handleRemark) {
        actions.push({
          name: 'appendHandleRemark',
        });
      }
      // 7. allowForward
      // 8. allowSubstitute
      // ok
      return actions;
    }
  }
  return FlowTask;
};
