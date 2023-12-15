const moduleInfo = module.info;
module.exports = class Queue {
  async execute(context) {
    const _behaviorBean = this.ctx.bean._newBean(`${moduleInfo.relativeName}.flow.behavior.overtime`);
    await _behaviorBean._runJob(context);
  }
};
