const moduleInfo = module.info;
module.exports = class Flow {
  get modelFlow() {
    return this.ctx.model.module(moduleInfo.relativeName).flow;
  }
  get modelFlowHistory() {
    return this.ctx.model.module(moduleInfo.relativeName).flowHistory;
  }
  get modelFlowNode() {
    return this.ctx.model.module(moduleInfo.relativeName).flowNode;
  }
  get modelFlowNodeHistory() {
    return this.ctx.model.module(moduleInfo.relativeName).flowNodeHistory;
  }

  get sqlProcedure() {
    return this.ctx.bean._getBean(moduleInfo.relativeName, 'local.procedure');
  }
};
