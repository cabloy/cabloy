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
    return {
    };
  },
  mounted() {
  },
  beforeDestroy() {
  },
  methods: {
    onItemClick(event, item) {
      const url = `/a/flowtask/flow?flowId=${item.flowId}`;
      this.$view.navigate(url);
    },
    _getMessageClassNameFull(item) {
      return `${item.module}:${item.messageClassName}`;
    },
    _getItemMetaMedia(item) {
      const media = (item._meta && item._meta.media) || item.avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 24);
    },
    _getItemMetaMediaLabel(item) {
      const mediaLabel = (item._meta && item._meta.mediaLabel) || item.userName;
      return mediaLabel;
    },
    _getItemMetaSummary(item) {
      const summary = (item._meta && item._meta.summary) || '';
      return summary;
    },
    _getItemMetaFlags(item) {
      const flags = [];
      if (item.flowNodeNameCurrentLocale) {
        flags.push(item.flowNodeNameCurrentLocale);
      }
      if (item.flowRemarkLocale) {
        flags.push(item.flowRemarkLocale);
      }
      return flags;
    },
    _renderStats(item) {
      const stats = item.messageClass.info.stats;
      if (!stats) return;
      return (
        <eb-stats stats_params={stats.params} stats_color={stats.color}></eb-stats>
      );
    },
    _renderListItem(item) {
      // ok
      return (
        <eb-list-item key={this._getMessageClassNameFull(item)}
          link="#" title={item.messageClass.info.titleLocale}
          propsOnPerform={event => this.onPerformItem(event, item)}>
          <div slot="after">
            {this._renderStats(item)}
          </div>
        </eb-list-item>
      );
    },
    _renderList() {
      const items = this.layout.items;
      const children = [];
      for (const item of items) {
        children.push(this._renderListItem(item));
      }
      return (
        <f7-list>
          {children}
        </f7-list>
      );
    },
  },
  render() {
    return (
      <div>
        {this._renderList()}
      </div>
    );
  },
};
