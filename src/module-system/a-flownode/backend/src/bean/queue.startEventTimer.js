const moduleInfo = module.info;
module.exports = class Queue {
  async execute(context) {
    const _nodeBaseBean = this.ctx.bean._newBean(`${moduleInfo.relativeName}.flow.node.startEventTimer`);
    await _nodeBaseBean._runSchedule(context);
  }
};
