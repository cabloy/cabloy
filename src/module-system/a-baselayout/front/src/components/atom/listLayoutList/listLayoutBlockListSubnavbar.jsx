import Init from './subnavbar/init.jsx';
import Tabs from './subnavbar/tabs.jsx';
import QuickFilter from './subnavbar/quickFilter.jsx';

export default {
  meta: {
    global: false,
  },
  mixins: [Init, Tabs, QuickFilter],
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
    blockOptions: {
      type: Object,
    },
  },
  data() {
    return {
      tabs: [],
      quickFilter: null,
    };
  },
  computed: {
    filterData() {
      return this.$meta.util.getProperty(this.layoutManager, 'filter.data');
    },
    form() {
      return this.filterData.form;
    },
    formAtomClass() {
      return this.filterData.formAtomClass;
    },
    atomClass() {
      return this.form.atomClass;
    },
    stage() {
      return this.form.stage;
    },
  },
  mounted() {
    this.__init({ initDicts: true });
  },
  methods: {
    async onPolicy() {
      return false;
      // init
      await this.__init({ initDicts: false });
      // check tabs
      if (this.tabs.length === 0 && !this.quickFilter) {
        return false;
      }
      return {
        render: true,
        enable: true,
      };
    },
  },
  render() {
    return (
      <f7-subnavbar>
        <div class="atom-list-subnavbar-container">
          {this._renderTabs()}
          {this._renderQuickFilter()}
        </div>
      </f7-subnavbar>
    );
  },
};
