import Vue from 'vue';

import axios from 'axios';

import Framework7 from 'framework7/dist/framework7.esm.bundle.js';
import Framework7Vue from 'framework7-vue/dist/framework7-vue.esm.bundle.js';

// eslint-disable-next-line
import MaterialIconsCSS from '../css/iconfont/material-icons.css'

import main from '../../../src/front/main.js';

// meta
const meta = Vue.prototype.$meta = {};

// constants
meta.constant = require('./base/constant.js').default;

// eventHub
meta.eventHub = new Vue();

// install main
Vue.use(main, ops => {

  // meta.provider
  meta.provider = ops.meta.provider;

  // prepare store
  meta.store = ops.options.store = require('./base/store.js').default(Vue, ops.store);

  // prepare config
  meta.config = require('./base/config.js').default(Vue, ops.config);

  // prepare locales
  meta.locales = require('./base/locales.js').default(Vue, ops.locales);

  // prepare api
  if (ops.axios) meta.api = require('./base/api.js').default(Vue, ops.axios);

  // prepare vue options
  const options = prepareVueOptions(ops);

  // meta.options
  meta.options = options;

  // new vue
  new Vue(options);

});

// prepare vue options
function prepareVueOptions(ops) {

  // el
  ops.options.el = '#app';
  ops.options.template = '<app/>';

  // framework7 or vuerouter
  if (ops.meta.provider === 'framework7') {
    // framework7
    ops.options.framework7.root = '#app';
    return require('./inject/framework7.js').default(Vue, ops.options);
  } else if (ops.meta.provider === 'vuerouter') {
    // vue-router
    require('./inject/vuerouter.js').default(Vue, ops.options.router);
    return ops.options;
  }

  // not support
  throw new Error('should be framework7 or vuerouter!');

}

