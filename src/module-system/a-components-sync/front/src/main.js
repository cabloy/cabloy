let Vue;

// import formEvent from './directives/formEvent.js';
import './assets/css/module.css';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  // register directives
  // Vue.directive('ebFormEvent', formEvent);

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
