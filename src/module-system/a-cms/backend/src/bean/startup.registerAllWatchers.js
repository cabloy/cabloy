module.exports = app => {
  class Startup extends app.meta.BeanBase {
    async execute() {
      // only in development
      if (!app.meta.isLocal) return;
      await this._registerCms();
    }

    async _registerCms() {
      // config
      const configWatchAtomClass = this.ctx.config.watch.atomClass;
      // loop modules
      for (const module of app.meta.modulesArray) {
        // loop atomClasses
        const atoms = this.ctx.bean.util.getProperty(module, 'main.meta.base.atoms');
        if (!atoms) continue;
        for (const key in atoms) {
          if (atoms[key].info.cms !== true) continue;
          // atomClass
          const atomClass = {
            module: module.info.relativeName,
            atomClassName: key,
          };
          // check if watch
          if (this.ctx.bean.util.checkIfSameAtomClass(configWatchAtomClass, atomClass)) {
            const build = this.ctx.bean.cms.build({ atomClass });
            await build.registerWatchers();
          }
        }
      }
    }
  }

  return Startup;
};
