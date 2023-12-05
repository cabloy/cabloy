import './assets/css/module.less';

let Vue;

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  // options
  return cb({
    routes: require('./routes.js').default,
    config: require('./config/config.js').default,
    locales: require('./config/locales.js').default,
    components: require('./components.js').default,
    mixins: require('./mixins.js').default(Vue),
  });
}

// export
export default {
  install,
};
