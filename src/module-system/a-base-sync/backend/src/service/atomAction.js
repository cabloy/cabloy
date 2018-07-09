module.exports = app => {

  class AtomAction extends app.Service {

    async register({ atomClassId, code }) {
      return await this.ctx.meta.atomAction.register({ atomClassId, code });
    }

  }

  return AtomAction;
};
