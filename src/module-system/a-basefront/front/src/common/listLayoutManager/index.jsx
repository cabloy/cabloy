import Vue from 'vue';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Bulk from './bulk.jsx';
import Search from './search.jsx';
import Select from './select.jsx';
// import Create from './create.jsx';
import Order from './order.jsx';
import Filter from './filter.jsx';
import Subnavbar from './subnavbar.jsx';
import Bottombar from './bottombar.jsx';
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;
const ebMenus = Vue.prototype.$meta.module.get('a-base').options.mixins.ebMenus;

// container: {
//   atomClass,
//   options,
//   params,
//   scene, // default/search/select/selecting/mine
//   layout,
// },

export default {
  mixins: [ ebAtomClasses, ebAtomActions, ebMenus, Base, Page, Layout, Bulk, Search, Select, Order, Filter, Subnavbar, Bottombar ],
  data() {
    return {
    };
  },
  created() {
    this.layout_prepareConfig().then(() => {
      this.base.ready = true;
      this.create_loadActions();
    });
  },
  beforeDestroy() {
    this.layout.instance = null;
    this.$emit('layoutManager:destroy');
  },
};
