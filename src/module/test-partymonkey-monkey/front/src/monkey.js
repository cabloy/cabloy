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

  function monkeyStore(moduleSelf, module) {
    const store = module.options.store;
    // monkey getters: message2
    const _message2 = store.getters.message2;
    store.getters.message2 = function(state) {
      const res = _message2(state);
      console.log('monkey-store message2:', res);
      return res;
    };
    // monkey mutations: setMessage
    const _setMessage = store.mutations.setMessage;
    store.mutations.setMessage = function(state, message) {
      _setMessage(state, message);
      console.log('monkey-store setMessage:', state.message);
    };
  }

  return {
    moduleLoaded({ module }) {
      if (module.name !== 'test-party') return;
      const moduleSelf = Vue.prototype.$meta.module.get('test-partymonkey');
      // route
      monkeyRoute(moduleSelf, module, 'willBeMonkeyed', pageMonkey);
      // store
      monkeyStore(moduleSelf, module);
    },
  };

}
