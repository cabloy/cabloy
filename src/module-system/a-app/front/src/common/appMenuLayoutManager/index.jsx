import Vue from 'vue';
import Base from './base.jsx';
import Layout from './layout.jsx';
const ebLayoutManagerBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebLayoutManagerBase;

// container: {
//   appKey,
//   layout,
// },

export default {
  mixins: [
    ebLayoutManagerBase, //
    Base,
    Layout,
  ],
  data() {
    return {};
  },
  created() {
    this.index_init();
  },
  methods: {
    async index_init() {
      await this.base_init();
      await this.layout_prepareConfigLayout();
      this.base.ready = true;
    },
  },
};
