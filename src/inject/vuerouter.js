/*
* @Author: zhennann
* @Date:   2017-09-12 20:48:23
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-13 21:31:44
*/

import util from '../base/util.js';

export default function(Vue, router) {

  // check if has inject root
  const routeInject = router.options.routes.find(route => {
    if (route.meta && route.meta.inject) return route;
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
    const moduleInfo = util.parseModuleInfo(to.path);
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

        installJS(m, moduleInfo, () => {
          return next(to.fullPath);
        });

      });

    });

  });

  let __index = 0;

  function installJS(m, moduleInfo, cb) {
    // install
    Vue.use(m.default, ops => {

      // concat routes
      const routes = ops.routes.map(route => {
        route.path = `/${moduleInfo.pid}/${moduleInfo.name}${route.path}`;
        return route;
      });

      // add routes
      const routesNew = routeInject ? [{
        path: `__module${++__index}`,
        alias: routeInject.path,
        component: routeInject.component,
        children: routes,
      }] : routes;

      router.addRoutes(routesNew);

      // ready
      router.__ebModules[moduleInfo.fullName] = m;

      return cb();
    });

  }

}
