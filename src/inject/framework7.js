/*
* @Author: zhennann
* @Date:   2017-09-10 21:31:56
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-13 21:31:54
*/

import extend from 'extend2';
import util from '../base/util.js';

export default function(Vue, options) {

  // f7 options
  const f7Options = {

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

              return this.__installJS(m, options, moduleInfo, cb);
            });
          });

        };

      },

      __installJS(m, options, moduleInfo, cb) {
        // install
        Vue.use(m.default, ops => {
          // concat routes
          const routes = ops.routes.map(route => {
            route.path = `/${moduleInfo.pid}/${moduleInfo.name}${route.path}`;
            return route;
          });
          this.$f7Router.routes = this.$f7Router.routes.concat(routes);

          // ready
          this.$f7Router.__ebModules[moduleInfo.fullName] = m;
          options.component = false;

          return cb(options);
        });

      },

    },

  };


  // extend options
  const optionsNew = {};
  extend(true, optionsNew, options);
  extend(true, optionsNew, f7Options);

  if (options.methods && options.methods.onF7Init) {
    optionsNew.methods.__onF7Init = options.methods.onF7Init;
  }

  return optionsNew;

}

