import Vue from 'vue';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Actions from './actions.jsx';
import Data from './data.jsx';
import Notification from './notification.jsx';
import Message from './message.jsx';
import Item from './other/item.jsx';
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
    Actions,
    Data,
    Notification,
    Message,
    Item,
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
