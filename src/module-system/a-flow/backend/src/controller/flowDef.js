module.exports = app => {

  class FlowDefController extends app.Controller {

    nodeBases() {
      return this.ctx.service.flowDef.nodeBases();
    }

    edgeBases() {
      return this.ctx.service.flowDef.edgeBases();
    }

  }
  return FlowDefController;
};
