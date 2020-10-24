import ebAtomClasses from '../atomClasses.js';
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

// container: {
//   atomClass,
//   options,
//   params,
//   scene, // default/search/select/selecting/mine
//   layout,
// },

export default {
  mixins: [ ebAtomClasses, ebMenus, Base, Page, Layout, Bulk, Search, Select, Create, Order, Filter, Subnavbar ],
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
};
