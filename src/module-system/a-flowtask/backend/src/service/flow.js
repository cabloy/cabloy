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
      const flow = await this.ctx.bean.flow.get({ flowId, history: true, user });
      if (!flow) this.ctx.throw(404);
      // locale
      if (flow.flowRemark) {
        flow.flowRemark = this.ctx.text(flow.flowRemark);
      }
      if (flow.flowNodeNameCurrent) {
        flow.flowNodeNameCurrent = this.ctx.text(flow.flowNodeNameCurrent);
      }
      // ok
      return flow;
    }

    async _data_atom({ flowId, atomId }) {
      // only read basic info
      //   a.atomFlowId = {flowId}
      const atom = await this.ctx.model.queryOne(`
        select a.*,a.id as atomId,b.module,b.atomClassName from aAtom a
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
            __or__: [
              { 'a.userIdAssignee': user.id },
              { 'a.flowTaskHidden': 0 },
            ],
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

