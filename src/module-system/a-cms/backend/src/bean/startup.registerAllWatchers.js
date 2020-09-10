const Build = require('../common/build.js');

module.exports = app => {
  class Startup extends app.meta.BeanBase {

    async execute() {
      // only in development
      if (!app.meta.isLocal) return;
      // loop modules
      for (const module of app.meta.modulesArray) {
        // cms.site=true
        if (module.package.eggBornModule && module.package.eggBornModule.cms && module.package.eggBornModule.cms.site) {
          // loop atomClasses
          for (const key in module.main.meta.base.atoms) {
            if (module.main.meta.base.atoms[key].info.cms === false) continue;
            // atomClass
            const atomClass = {
              module: module.info.relativeName,
              atomClassName: key,
              atomClassIdParent: 0,
            };
            const build = Build.create(this.ctx, atomClass);
            await build.registerWatchers();
          }
        }
      }
    }

  }

  return Startup;
};
