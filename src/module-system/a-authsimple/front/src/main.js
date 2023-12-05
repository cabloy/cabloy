import blockSignin from './components/blockSignin.vue';
import './assets/css/module.css';

let Vue;

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  return cb({
    routes: require('./routes.js').default,
    config: require('./config/config.js').default,
    locales: require('./config/locales.js').default,
    components: {
      blockSignin,
    },
  });
}

// export
export default {
  install,
};
