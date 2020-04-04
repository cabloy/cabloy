import pageMonkey from './pages/monkey.vue';

// eslint-disable-next-line
export default function(Vue) {

  function monkeyRoute(moduleSelf, module, routePath, routeComponent) {
    const route = module.options.routes.find(item => item.path === routePath);
    if (route) {
      route.component = routeComponent;
      route.module = moduleSelf;
    }
  }

  return {
    moduleLoaded({ module }) {
      if (module.name !== 'test-party') return;
      const moduleSelf = Vue.prototype.$meta.module.get('test-partymonkey');
      // route
      monkeyRoute(moduleSelf, module, 'willBeMonkeyed', pageMonkey);
    },
  };

}
