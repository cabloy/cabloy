/*
* @Author: zhennann
* @Date:   2017-09-12 20:48:23
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-20 18:10:17
*/

import util from '../base/util.js';
import moduleUtil from '../base/module-util.js';

export default function(Vue, router) {

  let __moduleIndex = 0;

  // check if has inject root
  const routeInject = router.options.routes.find(route => {
    if (route.meta && route.meta.inject) return route;
  });

  // load sync modules
  util.requireCSS();
  util.requireJS((m, moduleInfo) => {
    __installJS(m, moduleInfo, null);
  });
  util.requireJSLocal((m, moduleInfo) => {
    __installJS(m, moduleInfo, null);
  });

  // hook
  router.beforeEach((to, from, next) => {

    // matched
    if (to.matched.length > 0) {
      // check if need login
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!Vue.prototype.$meta.auth.state.loggedIn) {
          // emit event: login
          Vue.prototype.$meta.eventHub.$emit(
            Vue.prototype.$meta.constants.events.login,
            { redirect: to.fullPath }
          );
          return next(false);
        }
        return next();
      }
      return next();
    }

    // parse module info
    const moduleInfo = moduleUtil.parseInfo(to.path);
    if (!moduleInfo) return next(false);

    // check if module loaded
    if (!router.__ebModules) router.__ebModules = {};
    if (router.__ebModules[moduleInfo.fullName]) return next(false);

    //  import module
    util.importCSS(moduleInfo, () => {

      util.importJS(moduleInfo, (e, m) => {
        if (e) {
          console.log(e);
          return next(false);
        }

        __installJS(m, moduleInfo, () => {
          return next(to.fullPath);
        });

      });

    });

  });

  function __installJS(m, moduleInfo, cb) {
    // install
    Vue.use(m.default, ops => {

      // concat routes
      const routesRoot = [];
      const routes = ops.routes.map(route => {
        if (route.path.charAt(0) === '/') {
          route.path = `/${moduleInfo.pid}/${moduleInfo.name}${route.path}`;
          routesRoot.push(route);
          return null;
        }
        route.path = `/${moduleInfo.pid}/${moduleInfo.name}/${route.path}`;
        return route;
      }).filter(router => router);

      // add routes
      const routesNew = routeInject ? [{
        path: `__module${++__moduleIndex}`,
        alias: routeInject.path,
        component: routeInject.component,
        children: routes,
      }] : routes;

      router.addRoutes(routesNew);

      if (routesRoot.length > 0)router.addRoutes(routesRoot);

      // ready
      if (!router.__ebModules) router.__ebModules = {};
      router.__ebModules[moduleInfo.fullName] = m;

      return cb && cb();
    });

  }

}
