module.exports = app => {
  class Startup extends app.meta.BeanBase {

    async execute() {
      await this.ctx.bean.flowDef._loadFlowDefBases();
    }

  }

  return Startup;
};
