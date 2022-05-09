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
      // setRead
      const messageIds = [item.id];
      this.$api
        .post('/a/socketio/message/setRead', {
          messageClass: this.layoutManager.base_messageClass,
          messageIds,
        })
        .then(() => {
          this.layoutManager.message_readSet({ message: item });
        });
      // content
      const content = JSON.parse(item.content);
      if (content.actionPath) {
        this.$view.navigate(content.actionPath);
      }
    },
    _getItemMetaMedia(content) {
      const media = content.issuerAvatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 24);
    },
    _getItemMetaMediaLabel(content) {
      const mediaLabel = content.issuerName;
      return mediaLabel;
    },
    _getItemMetaSummary(content) {
      const summary = content.body || '';
      return summary;
    },
    _getItemMetaFlags(item, content) {
      const flags = [];
      return flags;
    },
    _renderListItem(item) {
      // content
      const content = JSON.parse(item.content);
      // media
      const domMedia = (
        <div slot="media">
          <img class="avatar avatar24" src={this._getItemMetaMedia(content)} />
        </div>
      );
      // domHeader
      const domHeader = (
        <div slot="root-start" class="header">
          <div class="mediaLabel">
            <span>{this._getItemMetaMediaLabel(content)}</span>
          </div>
          <div class="date">
            <span>{this.$meta.util.formatDateTimeRelative(item.createdAt)}</span>
          </div>
        </div>
      );
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{content.title}</div>
        </div>
      );
      // domSummary
      const domSummary = (
        <div slot="root-end" class="summary">
          {this._getItemMetaSummary(content)}
        </div>
      );
      // domAfter
      const domAfterMetaFlags = [];
      for (const flag of this._getItemMetaFlags(item, content)) {
        domAfterMetaFlags.push(<f7-badge key={flag}>{flag}</f7-badge>);
      }
      if (!item.messageRead) {
        domAfterMetaFlags.push(<f7-icon key="messageRead" f7=":outline:mail-outline"></f7-icon>);
      }
      const domAfter = (
        <div slot="after" class="after">
          {domAfterMetaFlags}
        </div>
      );
      // ok
      return (
        <eb-list-item class="item" key={item.id} link="#" propsOnPerform={event => this.onItemClick(event, item)}>
          {domMedia}
          {domHeader}
          {domTitle}
          {domSummary}
          {domAfter}
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
