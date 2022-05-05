import Vue from 'vue';
import Base from './base.jsx';
import Layout from './layout.jsx';
const ebLayoutManagerBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebLayoutManagerBase;

// container: {
//   appKey,
//   layout,
// },

export default {
  mixins: [ebLayoutManagerBase, Base, Layout],
  data() {
    return {};
  },
  created() {
    this.index_load();
  },
  methods: {
    async index_load() {
      await this.base_init();
      await this.layout_prepareConfigLayout();
    },
  },
};
