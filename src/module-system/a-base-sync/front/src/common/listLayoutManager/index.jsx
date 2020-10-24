import ebAtomClasses from '../atomClasses.js';
import ebMenus from '../menus.js';
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
  mixins: [ ebAtomClasses, ebMenus, Layout, Bulk, Search, Select, Create, Order, Filter, Subnavbar ],
  data() {
    return {
      ready: false,
      configAtomBase: null,
      configAtom: null,
    };
  },
  computed: {
    user() {
      return this.$store.state.auth.user.op;
    },
    userLabels() {
      return this.$store.getters['a/base/userLabels'];
    },
  },
  created() {
    //
    this.$store.dispatch('a/base/getLabels');
    //
    this.layout_prepareConfig().then(() => {
      this.ready = true;

      this.create_loadActions();
    });
  },
  methods: {
    onPageRefresh(done) {
      done && done();
      this.layout_componentInstance && this.layout_componentInstance.onPageRefresh(true);
    },
    onPageInfinite() {
      this.layout_componentInstance && this.layout_componentInstance.onPageInfinite();
    },
    onPageClear() {
      this.layout_componentInstance && this.layout_componentInstance.onPageClear();
    },
    prepareSelectOptions() {
      // options
      let options = {
        where: { },
      };
      // search
      if (this.search.query) {
        options.where['a.atomName'] = { val: this.search.query, op: 'like' };
      }
      // select
      if (this.container.scene === 'select') {
        options.where['a.id'] = this.container.params.selectedAtomIds.length > 0 ? this.container.params.selectedAtomIds : null;
      }
      // mine
      if (this.container.scene === 'mine') {
        options.where['a.userIdCreated'] = this.user.id;
      }
      // order
      const atomOrderCurrent = this.order.selected || this.order_default;
      options.orders = [
        [ this.order_getKey(atomOrderCurrent), atomOrderCurrent.by ],
      ];
      // extend 1
      if (this.container.options) {
        options = this.$utils.extend({}, options, this.container.options);
      }
      // options
      return options;
    },
    prepareSelectParams() {
      // options
      const options = this.prepareSelectOptions();
      // params
      let params = {
        atomClass: this.container.atomClass,
        options,
      };
      // filter
      const filterParams = this.filter_prepareSelectParams();
      if (filterParams) {
        params = this.$utils.extend({}, params, filterParams);
      }
      return params;
    },
    getItems() {
      return this.layout_componentInstance ? this.layout_componentInstance.getItems() : [];
    },
    getPageTitle() {
      //
      if (this.container.params && this.container.params.pageTitle) return this.container.params.pageTitle;
      //
      const atomClass = this.getAtomClass(this.container.atomClass);
      const atomClassTitle = atomClass && atomClass.titleLocale;
      if (this.container.scene === 'select') {
        if (!atomClass) return `${this.$text('Select')} ${this.$text('Atom')}`;
        return `${this.$text('Select')} ${atomClassTitle}`;
      } else if (this.container.scene === 'selecting') {
        if (!atomClass) return `${this.$text('Selecting')} ${this.$text('Atom')}`;
        return `${this.$text('Selecting')} ${atomClassTitle}`;
      } else if (this.container.scene === 'search') {
        if (!atomClass) return `${this.$text('Search')} ${this.$text('Atom')}`;
        return `${this.$text('Search')} ${atomClassTitle}`;
      } else if (this.container.scene === 'mine') {
        return this.$text('My Atoms');
      }
      if (!atomClass) return this.$text('Atom');
      return `${this.$text('Atom')}: ${atomClassTitle}`;
    },
    getPageSubtitle() {
      const stage = this.getCurrentStage();
      if (stage === 'archive') return '';
      return this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
    },
    getCurrentStage() {
      let stage = this.$meta.util.getProperty(this.filter.data, 'form.stage');
      if (!stage) stage = this.container.options && this.container.options.stage;
      if (!stage) stage = 'archive';
      return stage;
    },
  },
};
