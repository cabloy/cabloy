import Vue from 'vue';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Bulk from './bulk.jsx';
import Search from './search.jsx';
import Select from './select.jsx';
import Order from './order.jsx';
import Filter from './filter.jsx';
import Subnavbar from './subnavbar.jsx';
import Actions from './actions.jsx';
import Data from './data.jsx';
import Star from './other/star.jsx';
import Labels from './other/labels.jsx';
import Event from './other/event.jsx';
import Item from './other/item.jsx';
const ebLayoutManagerBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebLayoutManagerBase;
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;

// container: {
//   atomClass,
//   options, // .atomIdMain .atomMain .flowTaskId
//   params,
//   scene, // default/search/select/selecting
//   layout,
//   resource,
//   mode,  // edit/view : for detail
// },

export default {
  mixins: [
    ebLayoutManagerBase, //
    ebAtomClasses,
    ebAtomActions,
    Base,
    Page,
    Layout,
    Bulk,
    Search,
    Select,
    Order,
    Filter,
    Subnavbar,
    Actions,
    Data,
    Star,
    Labels,
    Event,
    Item,
  ],
  data() {
    return {
      index: {
        layoutManagerScene: 'list',
        layoutManagerName: 'listLayoutManager',
      },
    };
  },
  created() {
    this.$nextTick(() => {
      this.index_init();
    });
  },
  methods: {
    async index_init() {
      await this.base_init();
      const res = await this.base_loadAtomClass();
      if (!res) return;
      await this.base_loadAtomMain();
      await this.select_prepareSelectedAtoms();
      await this.layout_prepareConfigLayout();
      await this.bulk_actionsInit();
      await this.filter_prepareData();
      await this.select_initCheckSelectedAtoms();
      this.base.ready = true;
    },
  },
};
