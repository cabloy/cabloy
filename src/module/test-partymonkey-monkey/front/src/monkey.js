import monkeyerPage from './pages/monkeyer.vue';
import monkeyerComponent from './components/monkeyerComponent.vue';

// eslint-disable-next-line
export default function(Vue) {

  function monkeyRoute(moduleSelf, module, routePath, routeComponent) {
    const route = module.options.routes.find(item => item.path === routePath);
    if (route) {
      route.module = moduleSelf;
      route.component = routeComponent;
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

  function monkeyConfig(moduleSelf, module) {
    const config = module.options.config;
    config.monkeyed = true;
  }

  function monkeyComponent(moduleSelf, module, componentName, component) {
    component.module = moduleSelf;
    module.options.components[componentName] = component;
  }

  return {
    moduleLoaded({ module }) {
      if (module.name !== 'test-party') return;
      const moduleSelf = Vue.prototype.$meta.module.get('test-partymonkey');
      // route
      monkeyRoute(moduleSelf, module, 'kitchen-sink/monkey/monkeyee', monkeyerPage);
      // store
      monkeyStore(moduleSelf, module);
      // config
      monkeyConfig(moduleSelf, module);
      // component
      monkeyComponent(moduleSelf, module, 'monkeyeeComponent', monkeyerComponent);
    },
  };

}
