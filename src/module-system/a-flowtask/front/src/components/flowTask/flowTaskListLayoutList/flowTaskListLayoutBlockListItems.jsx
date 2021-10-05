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
      const url = `/a/flowtask/flow?flowId=${item.flowId}&flowTaskId=${item.flowTaskId}`;
      this.$view.navigate(url);
    },
    _getItemMetaMedia(item) {
      const media =
        (item._meta && item._meta.media) ||
        item.flowUserAvatar ||
        this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 24);
    },
    _getItemMetaMediaLabel(item) {
      const mediaLabel = (item._meta && item._meta.mediaLabel) || item.flowUserName;
      return mediaLabel;
    },
    _getItemMetaSummary(item) {
      const handleRemark = this._getHandleRemark(item);
      return handleRemark || '';
    },
    _getItemMetaFlags(item) {
      const flags = [];
      if (item.flowTaskIdForwardFrom || item.flowTaskIdForwardTo) {
        flags.push(this.$text('ForwardAbbr'));
      }
      if (item.flowTaskIdSubstituteFrom || item.flowTaskIdSubstituteTo) {
        flags.push(this.$text('SubstituteAbbr'));
      }
      if (item.flowNodeNameLocale) {
        flags.push(item.flowNodeNameLocale);
      }
      return flags;
    },
    _getHandleRemark(task) {
      if (task.handleRemarkLocale) return task.handleRemarkLocale;
      if (task.flowTaskStatus === 0 && task.specificFlag === 1) {
        // assigneesConfirmation
        return this.$text('AssigneesConfirmationPrompt');
      }
      if (task.flowTaskStatus === 0 && task.specificFlag === 2) {
        // 可撤回
        return this.$text('Recall Available');
      }
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
            <span>{this.$meta.util.formatDateTimeRelative(item.timeHandled || item.updatedAt)}</span>
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
        <eb-list-item
          class="item"
          key={item.flowTaskId}
          link="#"
          propsOnPerform={event => this.onItemClick(event, item)}
        >
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
