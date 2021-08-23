import requirejs from '../vendors/requirejs/require.js';
import requirecss from '../vendors/requirejs/require-css.js';

export default function (Vue) {
  window.requirejs = requirejs.require;
  window.require = requirejs.require;
  window.define = requirejs.define;
  requirejs.require.config({});
}
