/*
* @Author: zhennann
* @Date:   2017-09-10 21:31:56
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-12 21:44:40
*/

import util from './util.js';

export default function(Vue) {

  return {

    methods: {

      onF7Init(f7) {

        if (this.__onF7Init) this.__onF7Init(f7);

        f7.routerPreOptions = (view, options) => {
          if (options.component === false || !options.url) return options;

          // parse module info
          const moduleInfo = util.parseModuleInfo(options.url);
          if (!moduleInfo) return options;

          // check if module loaded
          if (!this.$f7Router.__ebModules) this.$f7Router.__ebModules = {};
          if (this.$f7Router.__ebModules[moduleInfo.fullName]) return options;

          options.__ebModuleInfo = moduleInfo;
          options.component = true;
          return options;
        };

        f7.componentLoader = (view, options, cb) => {
          if (!options.__ebModuleInfo) return cb(options);

          const moduleInfo = options.__ebModuleInfo;

          util.importCSS(moduleInfo, () => {

            util.importJS(moduleInfo, (e, m) => {
              if (e) throw e;

              installJS.call(this, m, options, moduleInfo);

              return cb(options);
            });
          });

        };

      },


    },

  };

  function installJS(m, options, moduleInfo) {
    // install
    Vue.use(m.default);

    // concat routes
    const routes = m.default.routes.map(route => {
      route.path = `/${moduleInfo.pid}/${moduleInfo.name}${route.path}`;
      return route;
    });
    this.$f7Router.routes = this.$f7Router.routes.concat(routes);

    // ready
    this.$f7Router.__ebModules[moduleInfo.fullName] = m;
    options.component = false;
  }


}
