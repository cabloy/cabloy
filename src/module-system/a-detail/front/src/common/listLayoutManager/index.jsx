import Vue from 'vue';
import Base from './base.jsx';
import Layout from './layout.jsx';
import Bulk from './bulk.jsx';
import Actions from './actions.jsx';
import Data from './data.jsx';
import Event from './other/event.jsx';
import Item from './other/item.jsx';
const ebLayoutManagerBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebLayoutManagerBase;
const ebDetailClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebDetailClasses;
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
    ebLayoutManagerBase, //
    ebDetailClasses,
    ebDetailActions,
    Base,
    Layout,
    Bulk,
    Actions,
    Data,
    Event,
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
