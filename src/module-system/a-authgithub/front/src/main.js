import buttonGithub from './components/buttonGithub.jsx';
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
      buttonGithub,
    },
  });
}

// export
export default {
  install,
};
