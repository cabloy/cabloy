export default {
  data() {
    return {
      layout: {},
    };
  },
  methods: {
    layout_onGetLayoutConfigKeyCurrent() {
      return `appMine.base.render.item.layout.current.${this.container.mode}.${this.$view.size}`;
    },
    layout_onGetLayoutNames() {
      const configViewSize = this.$meta.util.getProperty(this.layout.configFull, 'info.layout.viewSize');
      return configViewSize[this.container.mode][this.$view.size];
    },
    async layout_onPrepareConfigFull() {
      // configAppMineBase
      const layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
        layoutKey: 'a-user:layoutAppMineBase',
      });
      this.base.configAppMineBase = layoutItem.content;
      // ok
      return this.base.configAppMineBase;
    },
    layout_renderLayout() {
      return this.layout_renderLayout_template_item();
    },
  },
};
