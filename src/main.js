import Vue from 'vue';
import Framework7 from 'framework7/dist/framework7.esm.bundle.js';
import Framework7Vue from 'framework7-vue/dist/framework7-vue.esm.bundle.js';
Vue.use(Framework7Vue, Framework7);

// eslint-disable-next-line
import MaterialIconsCSS from './css/iconfont/material-icons.css';

// meta
const meta = Vue.prototype.$meta = {};

// constants
meta.constant = require('./base/constant.js').default;

// eventHub
meta.eventHub = new Vue();

import main from '../../../src/front/main.js';
// install main
Vue.use(main, ops => {

  // prepare store
  meta.store = require('./base/store.js').default(Vue);

  // prepare config
  meta.config = require('./base/config.js').default(Vue, ops.config);

  // prepare locales
  meta.locales = require('./base/locales.js').default(Vue, ops.locales);

  // prepare api
  meta.api = require('./base/api.js').default(Vue);

  // prepare vue options
  const options = require('./inject/framework7.js').default(Vue, meta, ops.options);

  // meta.options
  meta.options = options;

  // new vue
  new Vue(options);

});
