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
  }
  return FlowTask;
};
