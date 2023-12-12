export default {
  methods: {
    async __init({ initDicts }) {
      await this.__initTabs();
      await this.__initQuickFilter();
      if (initDicts) {
        await this.__initTabsDicts();
      }
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
          tabs.push({ tabName, tabOptions, dictKey, dict: null });
        }
      }
      this.tabs = tabs;
    },
    async __initTabsDicts() {
      const useStoreDict = await this.$store.use('a/dict/dict');
      for (const tab of this.tabs) {
        // dict
        tab.dict = await useStoreDict.getDict({ dictKey: tab.dictKey });
      }
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
  },
};
