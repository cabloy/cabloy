// vue
const Vue = require('./base/vue.js').default;

// json
require('./base/json.js');

// meta
const meta = Vue.prototype.$meta = {};

// eventHub
meta.eventHub = new Vue();
// modules
meta.modules = {};
// modulesWaiting
meta.modulesWaiting = {};
// modulesMonkey
meta.modulesMonkey = {};
// module
meta.module = require('./base/module.js').default(Vue);
// util
meta.util = require('./base/util.js').default(Vue);
// theme
meta.theme = require('./base/theme.js').default(Vue);
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
