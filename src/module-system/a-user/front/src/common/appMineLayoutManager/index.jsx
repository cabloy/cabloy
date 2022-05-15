import Vue from 'vue';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Actions from './actions.jsx';
const ebLayoutManagerBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebLayoutManagerBase;
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;

// container: {
//   mode,  // edit/view
//   layout,
// },

export default {
  mixins: [
    ebLayoutManagerBase, //
    ebAtomActions,
    Base,
    Page,
    Layout,
    Actions,
  ],
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
      this.base.ready = true;
    },
  },
};
