import Vue from 'vue';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Bulk from './bulk.jsx';
import Actions from './actions.jsx';
const ebDetailActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebDetailActions;

// container: {
//   title,
//   mode,
//   flowTaskId,
//   atomId,
//   atom,
//   detailClass,
//   options,
//   layout,
// },

export default {
  mixins: [
    ebDetailActions,
    Base, Page, Layout, Bulk, Actions,
  ],
  data() {
    return {
    };
  },
  created() {
    this.layout_prepareConfig().then(() => {
      this.base.ready = true;
    });
  },
  beforeDestroy() {
    this.layout.instance = null;
    this.$emit('layoutManager:destroy');
  },
};
