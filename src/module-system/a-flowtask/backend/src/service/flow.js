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
          mode: 'flowing',
        },
        user,
      });
      if (flows.length === 0) this.ctx.throw(404);
      return flows[0];
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
          orders: [[ 'a.flowNodeId', 'desc' ]],
          history: 1,
        },
        user: null,
        pageForce: false,
      });
      return tasks;
    }

  }
  return Flow;
};

