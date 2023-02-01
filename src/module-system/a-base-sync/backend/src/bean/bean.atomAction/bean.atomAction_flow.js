module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomAction {
    async selectFlowActions({ atomClass, flowKey }) {
      atomClass = await ctx.bean.atomClass.get(atomClass);
      return await this.model.select({
        where: {
          atomClassId: atomClass.id,
          flowKey,
        },
      });
    }

    async getByModeFlow({ id, atomClassId, flowKey, nodeDefId, nodeDefName }) {
      const data = id ? { id } : { atomClassId, flowKey, nodeDefId };
      const res = await this.model.get(data);
      if (res) return res;
      // lock
      return await ctx.meta.util.lock({
        resource: `${moduleInfo.relativeName}.atomAction.register`,
        fn: async () => {
          return await ctx.meta.util.executeBeanIsolate({
            beanModule: moduleInfo.relativeName,
            beanFullName: 'atomAction',
            context: { atomClassId, flowKey, nodeDefId, nodeDefName },
            fn: '_registerLockByModeFlow',
          });
        },
      });
    }

    async _registerLockByModeFlow({ atomClassId, flowKey, nodeDefId, nodeDefName }) {
      return await this._registerLockByModeFlow_inner({ atomClassId, flowKey, nodeDefId, nodeDefName });
    }

    async _registerLockByModeFlow_inner({ atomClassId, flowKey, nodeDefId, nodeDefName }) {
      // get
      const res = await this.model.get({ atomClassId, flowKey, nodeDefId });
      if (res) return res;
      // code
      const sequence = ctx.bean.sequence.module(moduleInfo.relativeName);
      const flowActionCode = await sequence.next('flowAction');
      const data = {
        atomClassId,
        code: flowActionCode,
        name: nodeDefName,
        bulk: 0,
        actionMode: 1,
        flowKey,
        nodeDefId,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }
  }

  return AtomAction;
};
