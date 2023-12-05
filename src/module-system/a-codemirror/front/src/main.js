let Vue;

import './assets/css/module.less';

// install
function install(_Vue, cb) {
  if (Vue) return console.error('already installed.');

  Vue = _Vue;

  const codemirror_js = 'api/static/a/codemirror/lib/codemirror/lib/codemirror';
  const codemirror_modemeta_js = 'api/static/a/codemirror/lib/codemirror/mode/meta';
  const codemirror_css = 'css!api/static/a/codemirror/lib/codemirror/lib/codemirror';
  Vue.prototype.$meta.util.requirejs.require(
    [codemirror_js, codemirror_modemeta_js, codemirror_css],
    function (CodeMirror) {
      window.CodeMirror = CodeMirror;
      CodeMirror.__findMode = name => {
        let mode = window.CodeMirror.findModeByName(name);
        if (!mode) {
          mode = window.CodeMirror.findModeByExtension(name);
        }
        return mode;
      };
      CodeMirror.__loadMode = (mode, cb) => {
        if (cb) {
          Vue.prototype.$meta.util.requirejs.require(
            [`api/static/a/codemirror/lib/codemirror/mode/${mode}/${mode}`],
            cb
          );
          return;
        }
        return new Promise(resolve => {
          CodeMirror.__loadMode(mode, resolve);
        });
      };
      CodeMirror.__loadAddon = (addon, jsArr, cssArr, cb) => {
        if (cb) {
          if (jsArr && !Array.isArray(jsArr)) jsArr = [jsArr];
          if (cssArr && !Array.isArray(cssArr)) cssArr = [cssArr];
          const deps = [];
          if (jsArr) {
            for (const item of jsArr) {
              deps.push(`api/static/a/codemirror/lib/codemirror/addon/${addon}/${item}`);
            }
          }
          if (cssArr) {
            for (const item of cssArr) {
              deps.push(`css!api/static/a/codemirror/lib/codemirror/addon/${addon}/${item}`);
            }
          }
          Vue.prototype.$meta.util.requirejs.require(deps, cb);
          return;
        }
        return new Promise(resolve => {
          CodeMirror.__loadAddon(addon, jsArr, cssArr, resolve);
        });
      };
      return cb({
        routes: require('./routes.js').default,
            config: require('./config/config.js').default,
        locales: require('./config/locales.js').default,
        components: require('./components.js').default,
      });
    }
  );
}

// export
export default {
  install,
};
