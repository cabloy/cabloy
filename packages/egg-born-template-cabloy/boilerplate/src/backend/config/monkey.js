/* eslint-disable */
function monkeyRoute(module, routePath, routeController) {
  const route = module.main.routes.find(item => item.path === routePath);
  if (route) {
    route.controller = routeController;
  }
}
module.exports = class Monkey {
  moduleLoading({ module }) {}
  moduleLoaded({ module }) {}
  configLoaded({ module, config }) {}
  metaLoaded({ module, meta }) {}
};
/* eslint-enable */
