export default {
  data() {
    return {
      layout: {},
    };
  },
  methods: {
    layout_onGetLayoutConfigKeyCurrent() {
      return `appMine.base.render.item.layout.current.${this.$view.size}`;
    },
    async layout_onPrepareConfigFull() {
      // configAppMineBase
      if (!this.base.configAppMineBase) {
        const useStoreLayout = await this.$store.use('a/baselayout/layout');
        const layoutItem = await useStoreLayout.getLayoutItem({ layoutKey: 'a-user:layoutAppMineBase' });
        this.base.configAppMineBase = layoutItem.content;
      }
      // combine
      return this.$meta.util.extend({}, this.base.configAppMineBase, this.base.configAppMine);
    },
  },
};
