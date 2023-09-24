/* eslint-disable */
module.exports = app => {
  function monkeyRoute(module, routePath, routeController) {
    const route = module.main.routes.find(item => item.path === routePath);
    if (route) {
      route.controller = routeController;
    }
  }

  const monkey = {
    moduleLoading({ module }) {},
    moduleLoaded({ module }) {},
    configLoaded({ module, config }) {},
    metaLoaded({ module, meta }) {},
  };
  return monkey;
};
/* eslint-enable */
