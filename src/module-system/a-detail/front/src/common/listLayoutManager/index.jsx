import Vue from 'vue';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Bulk from './bulk.jsx';
import Actions from './actions.jsx';
import Data from './data.jsx';
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
    ebDetailActions, //
    Base,
    Page,
    Layout,
    Bulk,
    Actions,
    Data,
  ],
  data() {
    return {};
  },
  created() {
    this.index_init();
  },
  beforeDestroy() {
    this.$emit('layoutManager:destroy');
  },
  methods: {
    async index_init() {
      await this.layout_prepareConfig();
      await this.data_adapterInit();
      this.base.ready = true;
    },
  },
};
