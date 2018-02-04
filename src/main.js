import Vue from 'vue';
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
// store
meta.store = require('./base/store.js').default(Vue);
// api
meta.api = require('./base/api.js').default(Vue);

// install module main
const instanceMain = require('../../../src/front/main.js');
Vue.use(instanceMain.default, options => {
  // save module main
  const module = {
    name: 'main',
    instance: instanceMain,
    options,
  };
  meta.module.set('main', module);

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
