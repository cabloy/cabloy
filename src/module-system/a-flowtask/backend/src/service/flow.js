module.exports = app => {

  class Flow extends app.Service {

    async data({ flowId, user }) {
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
      const flow = flows[0];
      // select atom
      const atom = await this.ctx.bean.atom.read({ key: { atomId: flow.flowAtomId } });
      // select tasks
      const tasks = await this.ctx.bean.flowTask.select({
        options: {
          where: {
            'a.flowId': flowId,
          },
          orders: [[ 'a.flowNodeId', 'desc' ]],
          history: 1,
        },
        user: null,
        pageForce: false,
      });
      // ok
      return { flow, atom, tasks };
    }

  }
  return Flow;
};

