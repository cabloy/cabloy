import * as VueAll from 'vue';
import VuePluginDebug from './plugin/debug.js';
import VuePluginDevInfo from './plugin/devInfo.js';
import VuePluginPreload from './plugin/preload.js';
import VuePluginComponentMounted from './plugin/componentMounted.js';
import VuePluginRenderFreeze from './plugin/renderFreeze.js';

// exports
const Vue = VueAll.default;
Vue.exports = VueAll;

// Vue.get
async function __get_initializer_invoke(target, key, initializer) {
  try {
    await initializer();
  } catch (err) {
    delete target[key];
    // not use Vue.delete, which maybe cause infinite loop
    // Vue.delete(target, key);
    throw err;
  }
}
Vue.get = Vue.prototype.$get = function (target, key, initializer) {
  if (!(key in target)) {
    Vue.set(target, key, undefined);
    if (initializer) {
      __get_initializer_invoke(target, key, initializer);
    }
  }
  return target[key];
};

if (process.env.NODE_ENV === 'production') {
  Vue.config.productionTip = false;
}

// Vue
// eslint-disable-next-line
window.Vue = Vue;

// meta
const strats = Vue.config.optionMergeStrategies;
strats.meta = function (parentVal, childVal /* , vm, key */) {
  return Vue.prototype.$meta.util.extend({}, childVal, parentVal);
};

// plugin: debug
Vue.use(VuePluginDebug, { namespaces: process.env.DEBUG });
// plugin: ComponentMounted
Vue.use(VuePluginComponentMounted);
// plugin: renderFreeze
Vue.use(VuePluginRenderFreeze);
// plugin: Preload
Vue.use(VuePluginPreload);
// plugin: DevInfo
if (process.env.NODE_ENV === 'development') {
  Vue.use(VuePluginDevInfo);
}

export default Vue;
