let Vue;

import './assets/css/module.less';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  Vue.prototype.$meta.util.requirejs.require(['/api/static/a/codemirror/lib/codemirror/lib/codemirror.js'], function () {
    return cb({
      routes: require('./routes.js').default,
      store: require('./store.js').default(Vue),
      config: require('./config/config.js').default,
      locales: require('./config/locales.js').default,
      components: require('./components.js').default,
    });
  });
}

// export
export default {
  install,
};
