module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Queue extends app.meta.BeanBase {
    async execute(context) {
      const _behaviorBean = this.ctx.bean._newBean(`${moduleInfo.relativeName}.flow.behavior.overtime`);
      await _behaviorBean._runJob(context);
    }
  }

  return Queue;
};
