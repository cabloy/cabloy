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
  // in wechat
  if (!Vue.prototype.$device.wechat) return;
  // register
  await __register();
}

async function __register() {
  const hostName = 'wechat';
  const capabilityName = 'shareLink';
  // register host
  await Vue.prototype.$meta.util.performAction({
    action: {
      actionModule: 'a-host',
      actionComponent: 'hosts',
      name: 'register',
    },
    item: {
      name: hostName,
      action: {
        module: 'a-hostwechat',
        component: 'capabilities',
      },
    },
  });
  // register capability
  await Vue.prototype.$meta.util.performAction({
    action: {
      actionModule: 'a-host',
      actionComponent: 'capabilities',
      name: 'register',
    },
    item: {
      name: capabilityName,
      host: hostName,
    },
  });
}

// export
export default {
  install,
};
