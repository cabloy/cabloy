module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {
    async execute(context) {
      const { user } = context;
      const modelFlowTask = ctx.model.module(moduleInfo).flowTask;
      const count = await modelFlowTask.count({
        userIdAssignee: user.id,
        flowTaskStatus: 0,
        timeClaimed: { op: 'notNull' },
      });
      return count;
    }
  }

  return Stats;
};
