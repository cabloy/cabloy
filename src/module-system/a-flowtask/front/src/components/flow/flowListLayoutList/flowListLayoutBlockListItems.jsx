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
    onItemClick(event, item) {
      const url = `/a/flowtask/flow?flowId=${item.flowId}`;
      this.$view.navigate(url);
    },
    _getItemMetaMedia(item) {
      const media =
        (item._meta && item._meta.media) || item.avatar || this.$meta.config.modules['a-base'].user.avatar.default;
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
    _renderListItem(item) {
      // media
      const domMedia = (
        <div slot="media">
          <img class="avatar avatar24" src={this._getItemMetaMedia(item)} />
        </div>
      );
      // domHeader
      const domHeader = (
        <div slot="root-start" class="header">
          <div class="mediaLabel">
            <span>{this._getItemMetaMediaLabel(item)}</span>
          </div>
          <div class="date">
            <span>{this.$meta.util.formatDateTimeRelative(item.timeEnd || item.updatedAt)}</span>
          </div>
        </div>
      );
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.flowName}</div>
        </div>
      );
      // domSummary
      const domSummary = (
        <div slot="root-end" class="summary">
          {this._getItemMetaSummary(item)}
        </div>
      );
      // domAfter
      const domAfterMetaFlags = [];
      for (const flag of this._getItemMetaFlags(item)) {
        domAfterMetaFlags.push(<f7-badge key={flag}>{flag}</f7-badge>);
      }
      const domAfter = (
        <div slot="after" class="after">
          {domAfterMetaFlags}
        </div>
      );
      // ok
      return (
        <eb-list-item class="item" key={item.flowId} link="#" propsOnPerform={event => this.onItemClick(event, item)}>
          {domMedia}
          {domHeader}
          {domTitle}
          {domSummary}
          {domAfter}
        </eb-list-item>
      );
    },
    _renderList() {
      const items = this.layout.items;
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
