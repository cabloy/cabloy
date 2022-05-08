export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  mounted() {},
  beforeDestroy() {},
  methods: {
    onPerformItem(event, item) {
      const url = `/a/message/list?messageClass=${encodeURIComponent(JSON.stringify(item.messageClass))}`;
      this.$view.navigate(url, { target: '_self' });
    },
    _getMessageClassNameFull(item) {
      return `${item.module}:${item.messageClassName}`;
    },
    _renderStats(item) {
      const stats = item.messageClass.info.uniform.stats;
      if (!stats) return;
      return <eb-stats-color stats_params={stats.params}></eb-stats-color>;
    },
    _renderListItem(item) {
      // ok
      return (
        <eb-list-item
          key={this._getMessageClassNameFull(item)}
          link="#"
          title={item.messageClass.info.titleLocale}
          propsOnPerform={event => this.onPerformItem(event, item)}
        >
          <div slot="after">{this._renderStats(item)}</div>
        </eb-list-item>
      );
    },
    _renderList() {
      const items = this.layoutManager.data_getItems();
      const children = [];
      for (const item of items) {
        children.push(this._renderListItem(item));
      }
      return <f7-list>{children}</f7-list>;
    },
  },
  render() {
    return <div>{this._renderList()}</div>;
  },
};
