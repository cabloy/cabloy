/*
* @Author: zhennann
* @Date:   2017-09-12 20:48:23
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-27 11:50:09
*/

import util from '../base/util.js';
import mparse from 'egg-born-mparse';

export default function(Vue, router) {

  let __moduleIndex = 0;

  // check if has inject root
  const routeInject = router.options.routes.find(route => {
    return (route.meta && route.meta.inject);
  });

  // load sync modules
  util.requireModules((m, moduleInfo) => {
    __installJS(m, moduleInfo, null);
  });

  // remove app loading
  util.removeAppLoading();

  // hook
  router.beforeEach((to, from, next) => {

    // matched
    if (to.matched.length > 0) {
      // check if need login
      if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!Vue.prototype.$meta.store.state.auth.loggedIn) {
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
    const moduleInfo = mparse.parseInfo(to.path);
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

      // register module resources
      util.registerModuleResources(ops, moduleInfo, Vue);

      // ready
      if (!router.__ebModules) router.__ebModules = {};
      router.__ebModules[moduleInfo.fullName] = m;

      return cb && cb();
    });

  }

}
