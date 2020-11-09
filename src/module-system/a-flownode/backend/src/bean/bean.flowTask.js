module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {

    async select({ options, user }) {
      return [];
    }

    async _createTaskInstance({ nodeInstance, userIdAssignee }) {
      const task = ctx.bean._newBean(`${moduleInfo.relativeName}.local.flow.task`, {
        nodeInstance,
      });
      await task.init({ userIdAssignee });
      return task;
    }

  }

  return FlowTask;
};
