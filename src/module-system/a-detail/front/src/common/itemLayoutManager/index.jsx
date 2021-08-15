import Vue from 'vue';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Subnavbar from './subnavbar.jsx';
import Actions from './actions.jsx';
import Validate from './validate.jsx';
const ebDetailActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebDetailActions;

// container: {
//   mode,  // edit/view
//   flowTaskId,
//   detailId,
//   detailItemId,
//   layout,
// },

export default {
  mixins: [ebDetailActions, Base, Page, Layout, Subnavbar, Actions, Validate],
  data() {
    return {};
  },
  created() {
    this.index_load();
  },
  beforeDestroy() {
    this.$emit('layoutManager:destroy');
  },
  methods: {
    async index_load() {
      const res = await this.base_loadItem();
      if (!res) return;
      await this.layout_prepareConfig();
      this.base.ready = true;
    },
  },
};
