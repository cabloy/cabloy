export default {
  data() {
    return {};
  },
  methods: {
    layout_onGetLayoutConfigKeyCurrent() {
      const atomClassKey = this.container.atomClass
        ? `${this.container.atomClass.module}_${this.container.atomClass.atomClassName}`
        : null;
      return `atom.${atomClassKey}.render.list.layout.current.${this.$view.size}`;
    },
    layout_onSwipeoutOpened(event, item) {
      this.actions_fetchActions(item);
    },
    layout_onColumnNameEqualOrder(atomOrder, columnName) {
      const key = this.order_getKey(atomOrder);
      return key === `a.${columnName}` || key === `f.${columnName}` || key === columnName;
    },
    layout_onGetLayoutKeyBase() {
      let layoutKeyBase = this.container.layoutKeyBase;
      if (!layoutKeyBase) {
        const atomClassBase = this.base.atomClassBase;
        layoutKeyBase =
          atomClassBase && atomClassBase.itemOnly
            ? 'a-basefront:layoutItemOnlyListBase'
            : 'a-basefront:layoutAtomListBase';
      }
      return layoutKeyBase;
    },
    async layout_onPrepareConfigFull() {
      const atomClass = this.base.atomClass;
      const atomClassBase = this.base.atomClassBase;
      // atom base
      const layoutKeyBase = this.layout_onGetLayoutKeyBase();
      const useStoreLayout = await this.$store.use('a/baselayout/layout');
      let layoutItem = await useStoreLayout.getLayoutItem({ layoutKey: layoutKeyBase });
      this.base.configAtomBase = layoutItem.content;
      // atom cms
      if (atomClass && atomClassBase.cms) {
        layoutItem = await useStoreLayout.getLayoutItem({ layoutKey: 'a-cms:layoutAtomListCms' });
        this.base.configAtomCms = layoutItem.content;
      }
      // atom
      if (atomClass) {
        let atomLayoutKey = this.$meta.util.getProperty(atomClassBase, 'layout.config.atomList');
        atomLayoutKey = this.$meta.util.normalizeResourceKey(atomLayoutKey, atomClass.module);
        if (atomLayoutKey) {
          layoutItem = await useStoreLayout.getLayoutItem({ layoutKey: atomLayoutKey });
          this.base.configAtom = layoutItem.content;
        }
      }
      // combine
      return this.$meta.util.extend({}, this.base.configAtomBase, this.base.configAtomCms, this.base.configAtom);
    },
  },
};
