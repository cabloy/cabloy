let Vue;

import './assets/css/module.less';

import dragdrop from './directives/dragdrop.js';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  // dragdrop
  Vue.directive('eb-dragdrop', dragdrop(Vue));

  //
  return cb({
    routes: require('./routes.js').default,
    store: require('./store.js').default(Vue),
    config: require('./config/config.js').default,
    locales: require('./config/locales.js').default,
    components: require('./components.js').default,
  });
}

// export
export default {
  install,
};
