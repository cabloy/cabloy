module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async checkResource(moduleInfo, options) {
      if (ctx.innerAccess) return;
      // useKey
      if (options.useKey) {
        const resourceAtomId = ctx.request.body.key.atomId;
        const res = await this._checkResource({ resourceAtomId });
        if (!res) ctx.throw(403);
        ctx.meta._resource = res;
        return;
      }
      // atomStaticKey/name
      if (!options.atomStaticKey && !options.name) ctx.throw(403);
      let atomStaticKeys = options.atomStaticKey;
      if (!atomStaticKeys && options.name) {
        const names = options.name.split(',');
        atomStaticKeys = names.map(name => {
          return `${options.module || ctx.module.info.relativeName}:${name}`;
        });
      }
      if (!Array.isArray(atomStaticKeys)) {
        atomStaticKeys = atomStaticKeys.split(',');
      }
      let res;
      for (const atomStaticKey of atomStaticKeys) {
        res = await this._checkResource({ atomStaticKey });
        if (res) break; // ok when any passed
      }
      if (!res) ctx.throw(403);
      ctx.meta._resource = res;
    }

    async _checkResource({ resourceAtomId, atomStaticKey }) {
      return await ctx.bean.resource.checkRightResource({
        resourceAtomId,
        atomStaticKey,
        user: ctx.state.user.op,
      });
    }
  }
  return Middleware;
};
