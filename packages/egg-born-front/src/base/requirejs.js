import requirejs from '../vendors/requirejs/require.js';
import requirecss from '../vendors/requirejs/require-css.js';

export default function (Vue) {
  // global
  window.requirejs = requirejs.require;
  window.require = requirejs.require;
  window.define = requirejs.define;
  // config
  const config = {};
  if (Vue.prototype.$meta.config.api.baseURL) {
    config.baseUrl = Vue.prototype.$meta.config.api.baseURL;
  }
  requirejs.require.config(config);
  // ready
  return requirejs;
}
