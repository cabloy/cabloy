module.exports = app => {
  class FlowDef extends app.Service {
    nodeBases() {
      return this.ctx.bean.flowDef.nodeBases();
    }

    edgeBases() {
      return this.ctx.bean.flowDef.edgeBases();
    }

    flowServiceBases() {
      return this.ctx.bean.flowDef.flowServiceBases();
    }
  }
  return FlowDef;
};
