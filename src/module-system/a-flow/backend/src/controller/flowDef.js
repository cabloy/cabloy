module.exports = class FlowDefController {
  behaviorBases() {
    const res = this.ctx.service.flowDef.behaviorBases();
    this.ctx.success(res);
  }

  nodeBases() {
    const res = this.ctx.service.flowDef.nodeBases();
    this.ctx.success(res);
  }

  edgeBases() {
    const res = this.ctx.service.flowDef.edgeBases();
    this.ctx.success(res);
  }

  flowServiceBases() {
    const res = this.ctx.service.flowDef.flowServiceBases();
    this.ctx.success(res);
  }
};
