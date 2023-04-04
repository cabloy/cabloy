module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Middleware {
    async execute(options, next) {
      // ignore
      if (!options.type) {
        // isAuthOpen
        const isAuthOpen = ctx.bean.authOpen.isAuthOpen();
        if (isAuthOpen && !options.enableAuthOpen && !ctx.innerAccess) return ctx.throw(403);
        // others
        return await next();
      }

      const types = options.type.split(',');
      if (types.length === 1) {
        await this.checkRight(types[0], moduleInfo, options);
      } else {
        let error;
        for (const type of types) {
          try {
            await this.checkRight(type, moduleInfo, options);
            // ok
            error = null;
            break;
          } catch (err) {
            error = err;
          }
        }
        if (error) throw error;
      }

      // next
      await next();
    }

    async checkRight(type, moduleInfo, options) {
      // atom
      if (type === 'atom') return await this.checkAtom(moduleInfo, options);

      // resource
      if (type === 'resource') return await this.checkResource(moduleInfo, options);

      // detail
      if (type === 'detail') return await this.checkDetail(moduleInfo, options);
    }
  }
  return Middleware;
};
