export default {
  data() {
    return {};
  },
  methods: {
    layout_onGetLayoutConfigKeyCurrent() {
      const atomClassKey = `${this.base.atomClass.module}_${this.base.atomClass.atomClassName}`;
      return `atom.${atomClassKey}.render.item.layout.current.${this.container.mode}.${this.$view.size}`;
    },
    async layout_onPrepareConfigFull() {
      const atomClass = this.base.atomClass;
      const atomClassBase = this.getAtomClass(atomClass);
      // atom base
      const useStoreLayout = await this.$store.use('a/baselayout/layout');
      let layoutItem = await useStoreLayout.getLayoutItem({ layoutKey: 'a-basefront:layoutAtomItemBase' });
      this.base.configAtomBase = layoutItem.content;
      // atom cms
      if (atomClassBase.cms) {
        layoutItem = await useStoreLayout.getLayoutItem({ layoutKey: 'a-cms:layoutAtomItemCms' });
        this.base.configAtomCms = layoutItem.content;
      }
      // atom
      let atomLayoutKey = this.$meta.util.getProperty(atomClassBase, 'layout.config.atomItem');
      atomLayoutKey = this.$meta.util.normalizeResourceKey(atomLayoutKey, atomClass.module);
      if (atomLayoutKey) {
        layoutItem = await useStoreLayout.getLayoutItem({ layoutKey: atomLayoutKey });
        this.base.configAtom = layoutItem.content;
      }
      // combine
      return this.$meta.util.extend({}, this.base.configAtomBase, this.base.configAtomCms, this.base.configAtom);
    },
  },
};
