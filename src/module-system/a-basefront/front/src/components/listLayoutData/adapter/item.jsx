export default {
  methods: {
    async item_onAction(event, item, action) {
      const _action = this.layoutManager.getAction(action);
      if (!_action) return;
      await this.$meta.util.performAction({ ctx: this.layoutManager, action: _action, item });
      this.$meta.util.swipeoutClose(event.target);
    },
    async item_onClick(event, item) {
      return await this.item_onAction(event, item, {
        module: item.module,
        atomClassName: item.atomClassName,
        name: 'read',
      });
    },
    item_getMetaMedia(item) {
      const media = (item._meta && item._meta.media) || item.avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 24);
    },
    item_getMetaMediaLabel(item) {
      const mediaLabel = (item._meta && item._meta.mediaLabel) || item.userName;
      return mediaLabel;
    },
    item_getMetaSummary(item) {
      const summary = (item._meta && item._meta.summary) || '';
      if (this.layoutManager.container.atomClass) {
        return summary;
      }
      const atomClass = this.layoutManager.getAtomClass({
        module: item.module,
        atomClassName: item.atomClassName,
      });
      if (!atomClass) return summary;
      return `${atomClass.titleLocale} ${summary}`;
    },
  },
};
