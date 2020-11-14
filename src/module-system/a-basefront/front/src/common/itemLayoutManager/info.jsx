export default {
  data() {
    return {
    };
  },
  methods: {
    info_onLabel() {
      // anonymous
      if (this.base_user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please Sign In')).then(() => {
          // login
          this.$meta.vueLayout.openLogin();
        });
        return;
      }
      // navigate
      const item = this.base.item;
      this.$view.navigate(`/a/base/atom/labels?atomId=${item.atomId}`, {
        // target: '_self',
      });
    },
    info_onStarSwitch() {
      const star = this.base.item.star ? 0 : 1;
      return this._info_onStarSwitch(star);

    },
    _info_onStarSwitch(star) {
      const item = this.base.item;
      // anonymous
      if (this.base_user.anonymous) {
        this.$view.dialog.confirm(this.$text('Please Sign In')).then(() => {
          // login
          this.$meta.vueLayout.openLogin();
        });
        return;
      }
      // key
      const key = {
        atomId: item.atomId,
        itemId: item.itemId,
      };
      //
      return this.$api.post('/a/base/atom/star', {
        key,
        atom: { star },
      }).then(data => {
        this.$meta.eventHub.$emit('atom:star', { key, star: data.star, starCount: data.starCount });
      });
    },
    info_getLabel(id) {
      return this.base_userLabels[id];
    },
    info_getItemMetaMedia(avatar) {
      const media = avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 16);
    },
    info_renderActionsLeft() {
      if (!this.base_ready) return;
      const item = this.base.item;
      const children = [];
      // comment
      if (item.atomStage === 0 || this.base.config.render.item.info.comment) {
        children.push(
          <eb-link key="actionsLeft:comment" iconMaterial="comment" iconBadge={item.commentCount} eb-href={`/a/base/comment/list?atomId=${item.atomId}`}></eb-link>
        );
      }
      // attachment
      if (this.base.config.render.item.info.attachment) {
        children.push(
          <eb-link key="actionsLeft:attachment" iconMaterial="attachment" iconBadge={item.attachmentCount} eb-href={`/a/base/attachment/list?atomId=${item.atomId}`}></eb-link>
        );
      }
      // star
      if (item.atomStage === 1) {
        children.push(
          <eb-link key="actionsLeft:star" iconMaterial={item.star ? 'star' : 'star_border'} propsOnPerform={this.info_onStarSwitch}></eb-link>
        );
      }
      // labels
      if (item.atomStage === 1) {
        const labels = item.labels ? JSON.parse(item.labels) : [];
        if (labels.length > 0) {
          for (const label of labels) {
            const _label = this.info_getLabel(label);
            children.push(
              <eb-link key={label} text={_label.text} style={ { color: _label.color } } propsOnPerform={this.info_onLabel}></eb-link>
            );
          }
        } else {
          children.push(
            <eb-link key="actionsLeft:label" iconMaterial='label' propsOnPerform={this.info_onLabel}></eb-link>
          );
        }
      }
      // ok
      return children;
    },
    info_renderAvatar() {
      const item = this.base.item;
      const children = [];
      let small = false;
      if (item.userIdCreated !== item.userIdUpdated) {
        small = true;
        children.push(
          <img key="avatar:one"
            class={`avatar ${small ? 'avatar12' : 'avatar16'}`}
            src={this.info_getItemMetaMedia(item.avatarUpdated)}
            title={item.userName}
          />
        );
      }
      children.push(
        <img key="avatar:two"
          class={`avatar ${small ? 'avatar12' : 'avatar16'}`}
          src={this.info_getItemMetaMedia(item.avatar)}
          title={item.userName}
        />
      );
      return (
        <div key="avatar" class="info-avatar">
          {children}
        </div>
      );
    },
    info_renderDate() {
      const item = this.base.item;
      const children = [];
      const dateCreated = this.$meta.util.formatDateTime(item.atomCreatedAt);
      const dateUpdated = this.$meta.util.formatDateTime(item.atomUpdatedAt);
      let small = false;
      if (dateCreated !== dateUpdated) {
        small = true;
        children.push(
          <div key="date:one">{dateUpdated}</div>
        );
      }
      if (small) {
        children.push(
          <div key="date:two">{dateCreated}</div>
        );
      } else {
        children.push(
          <div key="date:one2">{this.$meta.util.formatDate(item.atomCreatedAt)}</div>
        );
        children.push(
          <div key="date:two2">{this.$meta.util.formatTime(item.atomCreatedAt)}</div>
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
