import Vue from 'vue';
const ebLayoutManager = Vue.prototype.$meta.module.get('a-base').options.mixins.ebLayoutManager;

// container: {
//   appKey,
// },

export default {
  mixins: [ebLayoutManager],
  data() {
    return {};
  },
};
