import Vue from 'vue';
import Base from './base.jsx';
const ebLayoutManager = Vue.prototype.$meta.module.get('a-base').options.mixins.ebLayoutManager;

// container: {
//   appKey,
//   layout,
// },

export default {
  mixins: [ebLayoutManager, Base],
  data() {
    return {};
  },
  created() {
    this.index_load();
  },
  methods: {
    async index_load() {
      await this.base_init();
      await this.layoutBase_prepareConfigLayout();
    },
  },
};
