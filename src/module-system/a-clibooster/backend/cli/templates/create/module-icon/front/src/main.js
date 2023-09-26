let Vue;

import './assets/css/module.less';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  return cb({
    routes: require('./routes.js').default,
    stores: require('./stores.js').default,
    config: require('./config/config.js').default,
    locales: require('./config/locales.js').default,
    components: require('./components.js').default,
    icons: require('./config/icons.js').default,
  });
}

// export
export default {
  install,
};
