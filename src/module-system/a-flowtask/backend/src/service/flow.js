module.exports = app => {

  class Flow extends app.Service {

    async data({ flowId, user }) {
      // flow
      const flow = await this._data_flow({ flowId, user });
      // atom
      const atom = await this._data_atom({ flowId, atomId: flow.flowAtomId });
      // tasks
      const tasks = await this._data_tasks({ flowId, user });
      // ok
      return { flow, atom, tasks };
    }

    async _data_flow({ flowId, user }) {
      // select flow
      const flows = await this.ctx.bean.flow.select({
        options: {
          where: {
            'a.id': flowId,
          },
          mode: 'history',
        },
        user,
      });
      if (flows.length === 0) this.ctx.throw(404);
      const flow = flows[0];
      // locale
      if (flow.flowRemark) {
        flow.flowRemark = this.ctx.text(flow.flowRemark);
      }
      return flow;
    }

    async _data_atom({ flowId, atomId }) {
      // only read basic info
      //   a.atomFlowId = {flowId}
      const atom = await this.ctx.model.queryOne(`
        select a.*,b.module,b.atomClassName from aAtom a
           left join aAtomClass b on a.atomClassId=b.id
             where a.deleted=0 and a.iid=? and a.id=?
                   and a.atomFlowId=?
        `, [ this.ctx.instance.id, atomId, flowId ]);
      return atom;
    }

    async _data_tasks({ flowId, user }) {
      // select tasks
      const tasks = await this.ctx.bean.flowTask.select({
        options: {
          where: {
            'a.flowId': flowId,
            'b.flowNodeType': [ 'startEventAtom', 'activityUserTask' ],
          },
          orders: [
            [ 'a.flowNodeId', 'desc' ],
            [ 'a.flowTaskStatus', 'asc' ],
          ],
          history: 1,
        },
        user: null,
        pageForce: false,
      });
      // loop
      for (const task of tasks) {
        // locale
        task.flowNodeName = this.ctx.text(task.flowNodeName);
        if (task.flowNodeRemark) {
          task.flowNodeRemark = this.ctx.text(task.flowNodeRemark);
        }
        if (task.handleRemark) {
          task.handleRemark = this.ctx.text(task.handleRemark);
        }
        // actions
        if (task.userIdAssignee === user.id && task.flowTaskStatus === 0) {
          task._actions = await this.ctx.bean.flowTask.actions({ flowTaskId: task.flowTaskId, user });
        }
      }
      return tasks;
    }

  }
  return Flow;
};

