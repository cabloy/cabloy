module.exports = app => {

  class Flow extends app.Service {

    async data({ flowId, user }) {
      // flow
      const flow = await this._data_flow({ flowId, user });
      // atom
      const atom = await this._data_atom({ atomId: flow.flowAtomId });
      // tasks
      const tasks = await this._data_tasks({ flowId });
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

    async _data_atom({ atomId }) {
      // only read basic info
      const atom = await this.ctx.bean.atom.modelAtom.get({ id: atomId });
      return atom;
    }

    async _data_tasks({ flowId }) {
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
      // locale
      for (const task of tasks) {
        task.flowNodeName = this.ctx.text(task.flowNodeName);
        if (task.flowNodeRemark) {
          task.flowNodeRemark = this.ctx.text(task.flowNodeRemark);
        }
        if (task.handleRemark) {
          task.handleRemark = this.ctx.text(task.handleRemark);
        }
      }
      return tasks;
    }

  }
  return Flow;
};

