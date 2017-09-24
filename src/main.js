/*
* @Author: zhennann
* @Date:   2017-09-08 21:31:56
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-24 17:27:49
*/

import Vue from 'vue';

import main from '../../../src/front/main.js';

// meta
const meta = Vue.prototype.$meta = {};

// constants
meta.constants = require('./base/constant.js').default;

// eventHub
meta.eventHub = new Vue();

// install main
Vue.use(main, ops => {

  // meta.provider
  meta.provider = ops.meta.provider;

  // prepare store
  meta.store = ops.options.store = require('./base/store.js').default(Vue, ops.store);

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

