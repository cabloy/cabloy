/*
* @Author: zhennann
* @Date:   2017-09-10 21:31:56
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-14 11:36:37
*/

import extend from 'extend2';
import util from '../base/util.js';
import fns from '../base/fns.js';

export default function(Vue, options) {

  let f7Router;

  // f7 options
  const f7Options = {
    framework7: {
      preroute(view, options) {
        const route = f7Router.findMatchingRoute(options.url);
        if (route && route.route.meta && route.route.meta.requiresAuth && !Vue.prototype.$meta.auth.state.loggedIn) {
          // emit event: login
          Vue.prototype.$meta.eventHub.$emit(
            Vue.prototype.$meta.constants.events.login,
            { view, options }
          );
          return false;
        }
        return true;
      },
    },
    methods: {

      onF7Init(f7) {

        f7Router = this.$f7Router;

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
    optionsNew.methods.onF7Init = fns([ options.methods.onF7Init, f7Options.methods.onF7Init ]);
  }

  if (options.framework7 && options.framework7.preroute) {
    optionsNew.framework7.preroute = fns([ options.framework7.preroute, f7Options.framework7.preroute ]);
  }

  return optionsNew;

}

