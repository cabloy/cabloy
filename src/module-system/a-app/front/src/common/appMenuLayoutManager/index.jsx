import Vue from 'vue';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Data from './data.jsx';
import Bulk from './bulk.jsx';

const ebLayoutManagerBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebLayoutManagerBase;
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;

// container: {
//   appKey,
//   layout,
// },

export default {
  mixins: [
    ebLayoutManagerBase, //
    ebAtomActions,
    Base,
    Page,
    Layout,
    Data,
    Bulk,
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
