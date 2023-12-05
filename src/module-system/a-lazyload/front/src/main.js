let Vue;

import './assets/css/module.less';

import VueLazyload from 'vue-lazyload';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  // lazyload
  //   https://github.com/hilongjw/vue-lazyload
  Vue.use(VueLazyload, {
    observer: true,
  });

  return cb({
    routes: require('./routes.js').default,
    config: require('./config/config.js').default,
    locales: require('./config/locales.js').default,
    components: require('./components.js').default,
  });
}

// export
export default {
  install,
};
