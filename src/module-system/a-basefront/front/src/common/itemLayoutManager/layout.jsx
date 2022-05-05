export default {
  data() {
    return {};
  },
  methods: {
    layout_onGetLayoutConfigKeyCurrent() {
      const atomClassKey = `${this.base.atomClass.module}_${this.base.atomClass.atomClassName}`;
      return `atom.${atomClassKey}.render.item.layout.current.${this.container.mode}.${this.$view.size}`;
    },
    layout_onGetLayoutNames() {
      const configViewSize = this.$meta.util.getProperty(this.layout.configFull, 'info.layout.viewSize');
      return configViewSize[this.container.mode][this.$view.size];
    },
    async layout_onPrepareConfigFull() {
      const atomClass = this.base.atomClass;
      const atomClassBase = this.getAtomClass(atomClass);
      // atom base
      let layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
        layoutKey: 'a-basefront:layoutAtomItemBase',
      });
      this.base.configAtomBase = layoutItem.content;
      // atom cms
      if (atomClassBase.cms) {
        layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
          layoutKey: 'a-cms:layoutAtomItemCms',
        });
        this.base.configAtomCms = layoutItem.content;
      }
      // atom
      const atomLayoutKey = this.$meta.util.getProperty(atomClassBase, 'layout.config.atomItem');
      if (atomLayoutKey) {
        layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
          layoutKey: atomLayoutKey,
        });
        this.base.configAtom = layoutItem.content;
      }
      // combine
      return this.$meta.util.extend({}, this.base.configAtomBase, this.base.configAtomCms, this.base.configAtom);
    },
    layout_renderLayout() {
      if (this.base.notfound) {
        return (
          <f7-card>
            <f7-card-header>{this.$text('Friendly Tips')}</f7-card-header>
            <f7-card-content>{this.$text('Not Found')}</f7-card-content>
          </f7-card>
        );
      }
      return (
        <div>
          {this.layout_renderComponent()}
          {this.actions_renderPopover()}
        </div>
      );
    },
  },
};
