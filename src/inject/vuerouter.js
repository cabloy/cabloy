/*
* @Author: zhennann
* @Date:   2017-09-12 20:48:23
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-12 23:19:04
*/

import util from './util.js';

export default function(Vue, router) {

  const routeInject = router.options.routes.find(route => {
    if (route.meta && route.meta.inject) return route;
  });

  router.beforeEach((to, from, next) => {
    console.log(to);
    if (to.matched.length > 0) return next();

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

        installJS(m, moduleInfo);

        return next(to.fullPath);
      });

    });

  });

  let __index = 0;

  function installJS(m, moduleInfo) {
    // install
    Vue.use(m.default);

    // concat routes
    const routes = m.default.routes.map(route => {
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
  }

}
