module.exports = app => {

  class AtomAction extends app.Service {

    async register({ atomClassId, code }) {
      return await this.ctx.bean.atomAction.register({ atomClassId, code });
    }

  }

  return AtomAction;
};
