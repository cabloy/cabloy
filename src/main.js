/*
* @Author: zhennann
* @Date:   2017-09-08 21:31:56
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-20 17:25:10
*/

import Vue from 'vue';
import Vuex from 'vuex';

import main from '../../../src/front/main.js';

// meta
const meta = Vue.prototype.$meta = {};

// constants
meta.constants = require('./base/constant.js').default;

// eventHub
meta.eventHub = new Vue();

// prepare auth
meta.auth = prepareAuth();

// install main
Vue.use(main, ops => {

  // meta.provider
  meta.provider = ops.meta.provider;

  // prepare vue options
  const options = prepareVueOptions(ops);

  // meta.options
  meta.options = ops.options;

  // new vue
  new Vue(options);

});

// prepare vue options
function prepareVueOptions(ops) {

  if (ops.meta.provider === 'framework7') {
    // framework7
    return require('./inject/framework7.js').default(Vue, ops.options);
  } else if (ops.meta.provider === 'vuerouter') {
    // vue-router
    require('./inject/vuerouter.js').default(Vue, ops.options.router);
    return ops.options;
  }

  // not support
  throw new Error('should be framework7 or vuerouter!');

}

// prepare auth
function prepareAuth() {
  // install vuex
  Vue.use(Vuex);
  // store
  const auth = require('./base/auth.js').default(Vue);
  return new Vuex.Store(auth);
}

