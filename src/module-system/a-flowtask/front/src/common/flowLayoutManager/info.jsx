export default {
  data() {
    return {
    };
  },
  methods: {
    info_getItemMetaMedia(avatar) {
      const media = avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 16);
    },
    info_renderActionsLeft() {
      if (!this.base_ready) return;
      const atom = this.base.data.atom;
      if (!atom) return;
      const children = [];
      // comment
      if (this.base.config.render.item.info.comment) {
        children.push(
          <eb-link key="actionsLeft:comment" iconMaterial="comment" iconBadge={atom.commentCount} eb-href={`/a/basefront/comment/list?atomId=${atom.id}`}></eb-link>
        );
      }
      // attachment
      if (this.base.config.render.item.info.attachment) {
        children.push(
          <eb-link key="actionsLeft:attachment" iconMaterial="attachment" iconBadge={atom.attachmentCount} eb-href={`/a/basefront/attachment/list?atomId=${atom.id}`}></eb-link>
        );
      }
      // ok
      return children;
    },
    info_renderAvatar() {
      const flow = this.base.data.flow;
      const children = [];
      children.push(
        <img key="avatar:one"
          class="avatar avatar16"
          src={this.info_getItemMetaMedia(flow.avatar)}
          title={flow.userName}
        />
      );
      return (
        <div key="avatar" class="info-avatar">
          {children}
        </div>
      );
    },
    info_renderDate() {
      const flow = this.base.data.flow;
      const children = [];
      const dateCreated = this.$meta.util.formatDateTime(flow.createdAt);
      const dateEnd = this.$meta.util.formatDateTime(flow.timeEnd);
      let small = false;
      if (flow.timeEnd) {
        small = true;
        children.push(
          <div key="date:one">{dateCreated}</div>
        );
      }
      if (small) {
        children.push(
          <div key="date:two">{dateEnd}</div>
        );
      } else {
        children.push(
          <div key="date:one2">{this.$meta.util.formatDate(flow.createdAt)}</div>
        );
        children.push(
          <div key="date:two2">{this.$meta.util.formatTime(flow.createdAt)}</div>
        );
      }
      return (
        <div key="date" class='info-date'>
          {children}
        </div>
      );
    },
    info_renderActionsRight() {
      if (!this.base_ready) return;
      const children = [];
      // avatar
      children.push(this.info_renderAvatar());
      // date
      children.push(this.info_renderDate());
      // ok
      return children;
    },
  },
};
