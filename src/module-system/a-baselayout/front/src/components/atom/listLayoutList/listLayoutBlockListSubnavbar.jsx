export default {
  meta: {
    global: false,
  },
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
    form() {
      const filterData = this.$meta.util.getProperty(this.layoutManager, 'filter.data');
      return filterData.form;
    },
    atomClass() {
      return this.form.atomClass;
    },
    stage() {
      return this.form.stage;
    },
  },
  mounted() {
    this.__init();
  },
  methods: {
    async __init() {
      await this.__initTabs();
      await this.__initQuickFilter();
    },
    async __initTabs() {
      const stageCurrent = this.layoutManager.base_getCurrentStage();
      const tabsUse = this.blockOptions.left.tabsUse;
      const tabs = [];
      for (const tabName of tabsUse) {
        const tabOptions = this.blockOptions.left.tabs[tabName];
        // check stage
        if (!this.__checkStageValid(stageCurrent, tabOptions.stage)) continue;
        // dict key
        const dictKey = await this.__initTabDictKey({ tabName, tabOptions });
        if (dictKey) {
          tabs.push({ tabName, tabOptions, dictKey });
        }
      }
      this.tabs = tabs;
    },
    async __initQuickFilter() {
      const quickFilter = this.blockOptions.right.quickFilter;
      if (quickFilter.enable) {
        this.quickFilter = quickFilter;
      }
    },
    __checkStageValid(stageCurrent, stage) {
      if (!stageCurrent || !stage) return true;
      const parts = stage.split(',');
      return parts.includes(stageCurrent);
    },
    async __initTabDictKey({ tabName /* , tabOptions*/ }) {
      if (!this.atomClass) return null;
      // special for atomState
      if (tabName === 'atomState') {
        const useStoreAtomState = await this.$store.use('a/basestore/atomState');
        const dict = await useStoreAtomState.getDict({
          atomClass: this.atomClass,
          atomStage: this.stage,
        });
        return dict && dict.dictKey;
      }
      // from atomClassBase
      const useStoreAtomClasses = await this.$store.use('a/basestore/atomClasses');
      const atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass: this.atomClass });
      return this.$meta.util.getProperty(atomClassBase, `fields.dicts.${tabName}.dictKey`);
    },
    async onPolicy() {
      // init
      await this.__init();
      // check tabs
      if (this.tabs.length === 0 && !this.quickFilter) {
        return false;
      }
      return {
        render: true,
        enable: true,
      };
    },
    _renderTabs() {
      const domTabs = [];
      return <div class="actions-block actions-block-left">{domTabs}</div>;
    },
    _renderQuickFilter() {
      let domBulkActionsRight;
      if (this.layoutManager.bulk_renderActionsRight) {
        domBulkActionsRight = this.layoutManager.bulk_renderActionsRight();
      }
      return <div class="actions-block actions-block-right">{domBulkActionsRight}</div>;
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
