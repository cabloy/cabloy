module.exports = app => {

  class Hook extends app.Service {

    // register all hooks
    async registerAllHooks() {
      for (const module of this.app.meta.modulesArray) {
        if (module.main.meta && module.main.meta.hook) {
          this._registerHooks(module, 'before');
          this._registerHooks(module, 'after');
        }
      }
    }

    async _registerHooks(module, stage) {
      const hooksStage = module.main.meta.hook[stage];
      if (!hooksStage) return;
      const hooks = this.app.meta.geto('hooks').geto(stage);
      for (const hook of hooksStage) {
        hooks.geta(hook.path).push({ route: `/${module.info.url}/${hook.route}` });
      }
    }

  }

  return Hook;
};
