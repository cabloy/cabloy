export default {
  data() {
    return {
      layout: {},
    };
  },
  methods: {
    layout_onGetLayoutConfigKeyCurrent() {
      const appKey = this.container.appKey;
      return `appMenu.${appKey}.render.list.layout.current.${this.$view.size}`;
    },
    layout_onGetLayoutNames() {
      const configViewSize = this.$meta.util.getProperty(this.layout.configFull, 'info.layout.viewSize');
      return configViewSize[this.$view.size];
    },
    async layout_onPrepareConfigFull() {
      // configAppMenuBase
      let layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
        layoutKey: 'a-app:layoutAppMenuBase',
      });
      this.base.configAppMenuBase = layoutItem.content;
      // configAppMenu
      const layoutKey = this.base.appPresetConfig.menu.layout;
      if (layoutKey) {
        layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
          layoutKey,
        });
        this.base.configAppMenu = layoutItem.content;
      }
      // combine
      return this.$meta.util.extend({}, this.base.configAppMenuBase, this.base.configAppMenu);
    },
    layout_renderLayout() {
      return this.layout_renderLayout_template_list();
    },
  },
};
