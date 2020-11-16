module.exports = app => {

  class Flow extends app.Service {

    async data({ flowId, user }) {
      const list = await this.ctx.bean.flow.select({ options: {
        mode: 'history',
      }, user: this.ctx.state.user.op });
      console.log(list);
    }

  }
  return Flow;
};

