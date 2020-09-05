const CACHEMEMORY = Symbol('APP#__CACHEMEMORY');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class CacheMem extends ctx.app.meta.BeanModuleBase {

    constructor(moduleName) {
      super(ctx, `${moduleInfo.relativeName}.local.mem`);
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get memory() {
      return ctx.app.geto(CACHEMEMORY).geto(ctx.subdomain).geto(this.moduleName);
    }

    get(name) {
      const res = this.has(name);
      return res ? res.value : undefined;
    }

    set(name, value, timeout) {
      this.memory[name] = {
        value,
        timeout: timeout || 0,
        timestamp: new Date(),
      };
    }

    getset(name, value, timeout) {
      const valueOld = this.get(name);
      this.memory[name] = {
        value,
        timeout: timeout || 0,
        timestamp: new Date(),
      };
      return valueOld;
    }

    has(name) {
      const res = this.memory[name];
      if (!res) return null;
      return (res.timeout === 0 || (new Date() - res.timestamp) < res.timeout) ? res : null;
    }

    remove(name) {
      // remove this
      this._remove(name);
      // broadcast
      ctx.app.meta.broadcast.emit({
        subdomain: ctx.subdomain,
        module: 'a-cache',
        broadcastName: 'memRemove',
        data: { moduleName: this.moduleName, name },
      });
    }

    // by broadcast
    _remove(name) {
      delete this.memory[name];
    }

    clear() {
      // clear this
      this._clear();
      // broadcast
      ctx.app.meta.broadcast.emit({
        subdomain: ctx.subdomain,
        module: 'a-cache',
        broadcastName: 'memClear',
        data: { moduleName: this.moduleName },
      });
    }

    // by broadcast
    _clear() {
      ctx.app[CACHEMEMORY][ctx.subdomain][this.moduleName] = {};
    }

  }

  return CacheMem;
};
