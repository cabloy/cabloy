export default {
  methods: {
    item_renderListItem(item) {
      // content
      const content = JSON.parse(item.content);
      // media
      const domMedia = (
        <div slot="media">
          <img class="avatar avatar24" src={this.item_getItemMetaMedia(content)} />
        </div>
      );
      // domHeader
      const domHeader = (
        <div slot="root-start" class="header">
          <div class="mediaLabel">
            <span>{this.item_getItemMetaMediaLabel(content)}</span>
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
          {this.item_getItemMetaSummary(content)}
        </div>
      );
      // domAfter
      const domAfterMetaFlags = [];
      for (const flag of this.item_getItemMetaFlags(item, content)) {
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
        <eb-list-item class="item" link="#" propsOnPerform={event => this.item_onItemClick(event, item)}>
          {domMedia}
          {domHeader}
          {domTitle}
          {domSummary}
          {domAfter}
        </eb-list-item>
      );
    },
    item_onItemClick(event, item) {
      // setRead
      const messageIds = [item.id];
      this.$api
        .post('/a/socketio/message/setRead', {
          messageClass: this.base_messageClass,
          messageIds,
        })
        .then(() => {
          this.message_readSet({ message: item });
        });
      // content
      const content = JSON.parse(item.content);
      if (content.actionPath) {
        this.$view.navigate(content.actionPath);
      }
    },
    item_getItemMetaMedia(content) {
      return this.$meta.util.combineAvatarUrl(content.issuerAvatar, 24);
    },
    item_getItemMetaMediaLabel(content) {
      const mediaLabel = content.issuerName;
      return mediaLabel;
    },
    item_getItemMetaSummary(content) {
      const summary = content.body || '';
      return summary;
    },
    item_getItemMetaFlags(/* item, content*/) {
      const flags = [];
      return flags;
    },
  },
};
