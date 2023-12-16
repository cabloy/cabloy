const moduleInfo = module.info;

module.exports = class Flow {
  get modelFlow() {
    return ctx.model.module(moduleInfo.relativeName).flow;
  }
  get modelFlowHistory() {
    return ctx.model.module(moduleInfo.relativeName).flowHistory;
  }
  get modelFlowNode() {
    return ctx.model.module(moduleInfo.relativeName).flowNode;
  }
  get modelFlowNodeHistory() {
    return ctx.model.module(moduleInfo.relativeName).flowNodeHistory;
  }

  get sqlProcedure() {
    return ctx.bean._getBean(moduleInfo.relativeName, 'local.procedure');
  }
};
