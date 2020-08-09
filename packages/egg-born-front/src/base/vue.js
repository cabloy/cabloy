import Vue from 'vue';

// Vue
// eslint-disable-next-line
window.Vue = Vue;

// meta
const strats = Vue.config.optionMergeStrategies;
strats.meta = function(parentVal, childVal, vm, key) {
  return Vue.prototype.$meta.util.extend({}, childVal, parentVal);
};

export default Vue;
