let Vue;

import './assets/css/module.less';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  const codemirror_js = 'api/static/a/codemirror/lib/codemirror/lib/codemirror';
  const codemirror_css = 'css!api/static/a/codemirror/lib/codemirror/lib/codemirror';
  Vue.prototype.$meta.util.requirejs.require([codemirror_js, codemirror_css], function (CodeMirror) {
    window.CodeMirror = CodeMirror;
    CodeMirror.__loadMode = (mode, cb) => {
      Vue.prototype.$meta.util.requirejs.require([`api/static/a/codemirror/lib/codemirror/mode/${mode}/${mode}`], cb);
    };
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
