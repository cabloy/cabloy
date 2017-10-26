let Vue;

// import css
// eslint-disable-next-line
import CSS from './css/module.css';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  return cb({
    routes: require('./routes.js').default,
    store: require('./store.js').default(Vue),
    config: require('./config/config.js').default,
    locales: require('./config/locales.js').default,
  });
}

// export
export default {
  install,
};
