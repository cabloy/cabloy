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
    this.base_loadItem().then(res => {
      if (!res) return;
      this.layout_prepareConfig().then(() => {
        this.base.ready = true;
      });
    });
  },
  beforeDestroy() {
    this.layout.instance = null;
    this.$emit('layoutManager:destroy');
  },
};
