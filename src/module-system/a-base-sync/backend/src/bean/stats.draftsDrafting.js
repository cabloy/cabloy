module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Stats {
    async execute(context) {
      const { keys, user } = context;
      let atomClass;
      if (keys.length > 1) {
        const [module, atomClassName] = keys[1].split('_');
        atomClass = await ctx.bean.atomClass.get({
          module,
          atomClassName,
        });
      }
      const params = {
        userIdUpdated: user.id,
        atomStage: 0,
        atomClosed: 0,
        atomFlowId: 0,
      };
      if (atomClass) {
        params.atomClassId = atomClass.id;
      }
      const modelAtom = ctx.model.module(moduleInfo.relativeName).atom;
      const count = await modelAtom.count(params);
      return count;
    }
  }

  return Stats;
};
