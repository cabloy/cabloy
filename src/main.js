import Vue from 'vue';
import Framework7 from 'framework7/dist/framework7.esm.bundle.js';
import Framework7Vue from 'framework7-vue/dist/framework7-vue.esm.bundle.js';
Vue.use(Framework7Vue, Framework7);
Vue.prototype.$Framework7 = Framework7;

// eslint-disable-next-line
import Framework7CSS from 'framework7/dist/css/framework7.md.css';
// eslint-disable-next-line
import MaterialIconsCSS from './css/iconfont/material-icons.css';

// meta
const meta = Vue.prototype.$meta = {};

// constants
meta.constant = require('./base/constant.js').default;
// eventHub
meta.eventHub = new Vue();
// modules
meta.modules = {};
// modulesWaiting
meta.modulesWaiting = {};
// module
meta.module = require('./base/module.js').default(Vue);
// util
meta.util = require('./base/util.js').default(Vue);
// store
meta.store = require('./base/store.js').default(Vue);
// api
meta.api = require('./base/api.js').default(Vue);

// install main
import main from '../../../src/front/main.js';
Vue.use(main, options => {
  // config
  meta.config = require('./base/config.js').default(Vue, options.config);
  // locales
  meta.locales = require('./base/locales.js').default(Vue, options.locales);
  // vue parameters
  require('./inject/framework7.js').default(Vue, options, parameters => {
    meta.parameters = parameters;
    // new vue
    new Vue(parameters);
  });
});
