export default {
  methods: {
    item_renderListItem(item) {
      return (
        <eb-list-item
          key={this.item_getMessageClassNameFull(item)}
          link="#"
          title={item.messageClass.info.titleLocale}
          propsOnPerform={event => this.item_onPerformItem(event, item)}
        >
          <div slot="after">{this.item_renderStats(item)}</div>
        </eb-list-item>
      );
    },
    item_onPerformItem(event, item) {
      const url = `/a/message/list?messageClass=${encodeURIComponent(JSON.stringify(item.messageClass))}`;
      this.$view.navigate(url, { target: '_self' });
    },
    item_getMessageClassNameFull(item) {
      return `${item.module}:${item.messageClassName}`;
    },
    item_renderStats(item) {
      const stats = item.messageClass.info.uniform.stats;
      if (!stats) return;
      return <eb-stats-color stats_params={stats.params}></eb-stats-color>;
    },
  },
};
