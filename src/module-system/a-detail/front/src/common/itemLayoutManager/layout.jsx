export default {
  data() {
    return {};
  },
  created() {},
  methods: {
    layout_onGetLayoutConfigKeyCurrent() {
      const detailClassKey = `${this.base.detailClass.module}_${this.base.detailClass.detailClassName}`;
      return `detail.${detailClassKey}.render.item.layout.current.${this.container.mode}.${this.$view.size}`;
    },
    async layout_onPrepareConfigFull() {
      const detailClass = this.base.detailClass;
      const detailClassBase = this.getDetailClass(detailClass);
      // detail base
      let layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
        layoutKey: 'a-detail:layoutDetailItemBase',
      });
      this.base.configDetailBase = layoutItem.content;
      // detail
      let detailLayoutKey = this.$meta.util.getProperty(detailClassBase, 'layout.config.detailItem');
      detailLayoutKey = this.$meta.util.normalizeResourceKey(detailLayoutKey, detailClass.module);
      if (detailLayoutKey) {
        layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
          layoutKey: detailLayoutKey,
        });
        this.base.configDetail = layoutItem.content;
      }
      // combine
      return this.$meta.util.extend({}, this.base.configDetailBase, this.base.configDetail);
    },
    layout_renderLayout() {
      return this.layout_renderLayout_template_item();
    },
  },
};
