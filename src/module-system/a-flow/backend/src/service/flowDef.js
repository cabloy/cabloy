module.exports = class FlowDef {
  behaviorBases() {
    return this.ctx.bean.flowDef.behaviorBases();
  }

  nodeBases() {
    return this.ctx.bean.flowDef.nodeBases();
  }

  edgeBases() {
    return this.ctx.bean.flowDef.edgeBases();
  }

  flowServiceBases() {
    return this.ctx.bean.flowDef.flowServiceBases();
  }
};
