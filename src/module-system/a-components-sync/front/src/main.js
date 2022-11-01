let Vue;

import './assets/css/module.less';

import VueLazyload from 'vue-lazyload';
import dragdropUtilFn from './common/dragdrop.js';
import dragdrop from './directives/dragdrop.js';
import appMethods from './common/appMethods.js';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  // dragdrop
  const dragdropUtil = dragdropUtilFn(Vue);
  Vue.directive('eb-dragdrop', dragdrop(dragdropUtil));

  // lazyload
  //   https://github.com/hilongjw/vue-lazyload
  Vue.use(VueLazyload, {
    observer: true,
  });

  // utils
  const utils = {
    dragdrop: dragdropUtil,
    appMethods,
  };

  //
  return cb({
    routes: require('./routes.js').default,
    store: require('./store.js').default(Vue),
    config: require('./config/config.js').default,
    locales: require('./config/locales.js').default,
    components: require('./components.js').default,
    mixins: require('./mixins.js').default,
    utils,
  });
}

// export
export default {
  install,
};
