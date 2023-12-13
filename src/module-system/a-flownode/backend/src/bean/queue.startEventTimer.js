module.exports = app => {
  const moduleInfo = module.info;
  class Queue extends app.meta.BeanBase {
    async execute(context) {
      const _nodeBaseBean = this.ctx.bean._newBean(`${moduleInfo.relativeName}.flow.node.startEventTimer`);
      await _nodeBaseBean._runSchedule(context);
    }
  }

  return Queue;
};
