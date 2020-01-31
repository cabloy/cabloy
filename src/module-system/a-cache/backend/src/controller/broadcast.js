module.exports = app => {

  class BroadcastController extends app.Controller {

    async memRemove() {
      const { sameAsCaller, moduleName, name } = this.ctx.request.body;
      if (!sameAsCaller) {
        const moduleCache = this.ctx.cache.mem.module(moduleName);
        moduleCache._remove(name);
      }
      this.ctx.success();
    }

    async memClear() {
      const { sameAsCaller, moduleName } = this.ctx.request.body;
      if (!sameAsCaller) {
        const moduleCache = this.ctx.cache.mem.module(moduleName);
        moduleCache._clear();
      }
      this.ctx.success();
    }

  }

  return BroadcastController;

};
