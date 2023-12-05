let Vue;

import './assets/css/module.less';

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

  // utils
  const utils = {
    dragdrop: dragdropUtil,
    appMethods,
  };

  //
  return cb({
    routes: require('./routes.js').default,
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
