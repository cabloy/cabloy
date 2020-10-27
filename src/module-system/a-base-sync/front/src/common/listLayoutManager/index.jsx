import ebAtomClasses from '../atomClasses.js';
import ebAtomActions from '../atomActions.js';
import ebMenus from '../menus.js';
import Base from './base.jsx';
import Page from './page.jsx';
import Layout from './layout.jsx';
import Bulk from './bulk.jsx';
import Search from './search.jsx';
import Select from './select.jsx';
import Create from './create.jsx';
import Order from './order.jsx';
import Filter from './filter.jsx';
import Subnavbar from './subnavbar.jsx';
import Bottombar from './bottombar.jsx';

// container: {
//   atomClass,
//   options,
//   params,
//   scene, // default/search/select/selecting/mine
//   layout,
// },

export default {
  mixins: [ ebAtomClasses, ebAtomActions, ebMenus, Base, Page, Layout, Bulk, Search, Select, Create, Order, Filter, Subnavbar, Bottombar ],
  data() {
    return {
    };
  },
  created() {
    //
    this.$store.dispatch('a/base/getLabels');
    //
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
