import * as VueAll from 'vue';
import DevInfo from './plugin/devInfo.js';
import Preload from './plugin/preload.js';

// exports
const Vue = VueAll.default;
Vue.exports = VueAll;

// Vue.get
Vue.get = Vue.prototype.$get = function (target, key, initializer) {
  if (!(key in target)) {
    Vue.set(target, key, undefined);
    if (initializer) {
      initializer();
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

// plugin: DevInfo
if (process.env.NODE_ENV === 'development') {
  Vue.use(DevInfo);
}
// plugin: Preload
Vue.use(Preload);

export default Vue;
