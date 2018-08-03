import layout from './components/layout.vue';
import './assets/css/module.less';

let Vue;

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  // options
  return cb({
    routes: require('./routes.js').default,
    store: require('./store.js').default(Vue),
    config: require('./config/config.js').default,
    locales: require('./config/locales.js').default,
    components: {
      layout,
    },
  });
}

// export
export default {
  install,
};
