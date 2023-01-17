module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomAction {
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
      const data = {
        atomClassId,
        // code: flowActionCode,
        name: nodeDefName,
        bulk: 0,
        flowKey,
        nodeDefId,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      data.code = data.id;
      // update code = id
      await this.model.update({ id: data.id, code: data.id });
      // ok
      return data;
    }
  }

  return AtomAction;
};
