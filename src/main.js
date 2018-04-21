import Vue from 'vue';
import moment from 'moment';
import './assets/css/iconfont/material-icons.css';

// meta
const meta = Vue.prototype.$meta = {};

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
// moment
meta.moment = moment;
// mixin
require('./base/mixin.js').default(Vue);

// install module main
const instanceMain = require('../../../src/front/main.js');
meta.module.install(instanceMain, { relativeName: 'main' }, module => {
// vue parameters
  require('./inject/framework7.js').default(Vue, module.options, parameters => {
    meta.parameters = parameters;
    // new vue
    new Vue(parameters);
  });
});
