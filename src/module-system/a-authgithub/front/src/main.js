import buttongithub from './components/buttongithub.vue';
import './assets/css/module.css';

let Vue;

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  return cb({
    routes: require('./routes.js').default,
    store: require('./store.js').default(Vue),
    config: require('./config/config.js').default,
    locales: require('./config/locales.js').default,
    components: {
      buttongithub,
    },
  });
}

// export
export default {
  install,
};
