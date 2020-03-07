let Vue;

import './assets/css/module.less';

import chartjs from 'chart.js';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  // utils
  const utils = { chartjs };

  return cb({
    routes: require('./routes.js').default,
    store: require('./store.js').default(Vue),
    config: require('./config/config.js').default,
    locales: require('./config/locales.js').default,
    components: require('./components.js').default,
    utils,
  });
}

// export
export default {
  install,
};
