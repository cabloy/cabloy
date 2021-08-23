import requirejs from '../vendors/requirejs/require.js';

const requirecss_path = 'api/static/a/base/js/require-css/css.min';

export default function (Vue) {
  // global
  window.requirejs = requirejs.require;
  window.require = requirejs.require;
  window.define = requirejs.define;
  // config
  const config = {
    map: {
      '*': {
        css: requirecss_path,
      },
    },
  };
  if (Vue.prototype.$meta.config.api.baseURL) {
    config.baseUrl = Vue.prototype.$meta.config.api.baseURL;
  }
  requirejs.require.config(config);
  // ready
  return requirejs;
}
