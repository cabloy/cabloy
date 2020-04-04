import pageMonkey from './pages/monkey.vue';

// eslint-disable-next-line
export default function(Vue) {

  function monkeyRoute(module, routePath, routeComponent) {
    const route = module.options.routes.find(item => item.path === routePath);
    if (route) {
      route.component = routeComponent;
    }
  }

  return {
    moduleLoaded({ module }) {
      if (module.name !== 'test-party') return;
      // route
      monkeyRoute(module, 'willBeMonkeyed', pageMonkey);
    },
  };

}
