module.exports = app => {

  class FlowDef extends app.Service {

    async enable({ flowDefId }) {
      return await this.ctx.bean.flowDef.enable({ flowDefId });
    }

    async disable({ flowDefId }) {
      return await this.ctx.bean.flowDef.disable({ flowDefId });
    }

  }
  return FlowDef;
};

