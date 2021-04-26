let Vue;

import './assets/css/module.less';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  return cb({
    routes: require('./routes.js').default,
    store: require('./store.js').default(Vue),
    config: require('./config/config.js').default,
    locales: require('./config/locales.js').default,
    components: require('./components.js').default,
    onLoaded: __onLoaded,
  });
}

async function __onLoaded() {
  const config = Vue.prototype.$meta.config.modules['test-hostsimple'];
  if (!config.enableTest) return;
  // in localhost
  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') return;
  // capability: share link
  const action = {
    actionModule: 'a-host',
    actionComponent: 'capabilities',
    name: 'register',
  };
  const item = {
    name: 'shareLink',
    host: 'test-simple',
    action: {
      module: 'test-hostsimple',
      component: 'capabilities',
    },
  };
  await Vue.prototype.$meta.util.performAction({ action, item });
}

// export
export default {
  install,
};
