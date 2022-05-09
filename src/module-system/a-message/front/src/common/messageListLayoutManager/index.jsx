import Vue from 'vue';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Data from './data.jsx';
import Notification from './notification.jsx';
const ebLayoutManagerBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebLayoutManagerBase;

// container: {
//   messageClass,
// },

export default {
  mixins: [
    ebLayoutManagerBase, //
    Base,
    Page,
    Layout,
    Data,
    Notification,
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
      await this.data_adapterInit();
      this.base.ready = true;
    },
  },
};
