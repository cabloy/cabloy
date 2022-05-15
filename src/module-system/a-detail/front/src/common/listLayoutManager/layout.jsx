export default {
  data() {
    return {};
  },
  methods: {
    layout_onGetLayoutConfigKeyCurrent() {
      const detailClassKey = this.container.detailClass
        ? `${this.container.detailClass.module}_${this.container.detailClass.detailClassName}`
        : null;
      return `detail.${detailClassKey}.render.list.layout.current.${this.$view.size}`;
    },
    layout_onGetLayoutNames() {
      const configViewSize = this.$meta.util.getProperty(this.layout.configFull, 'info.layout.viewSize');
      return configViewSize[this.$view.size];
    },
    async layout_onPrepareConfigFull() {
      const detailClass = this.container.detailClass;
      const detailClassBase = this.getDetailClass(detailClass);
      // detail base
      let layoutItem = await this.$store.dispatch('a/baselayout/getLayoutItem', {
        layoutKey: 'a-detail:layoutDetailListBase',
      });
      this.base.configDetailBase = layoutItem.content;
      // detail
      let detailLayoutKey = this.$meta.util.getProperty(detailClassBase, 'layout.config.detailList');
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
    layout_renderTitle() {
      return (
        <f7-list-item groupTitle>
          <div class="detail-list-title-container">
            {this.layout_renderTitleLeft()}
            {this.layout_renderTitleRight()}
          </div>
        </f7-list-item>
      );
    },
    layout_renderTitleLeft() {
      const title = this.container.title;
      return <div class="actions-block actions-block-left">{title}</div>;
    },
    layout_renderTitleRight() {
      const children = this.bulk_renderActionsRight();
      return <div class="actions-block actions-block-right">{children}</div>;
    },
  },
};
