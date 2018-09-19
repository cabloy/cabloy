let Vue;

import LiquorTree from '@zhennann/liquor-tree';

import './assets/css/markdown/github.less';
import './assets/css/module.less';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  // register components
  Vue.component('ebTree', LiquorTree);

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
