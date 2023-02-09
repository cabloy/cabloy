export default {
  data() {
    return {};
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
      this.$view.navigate(`/a/basefront/atom/labels?atomId=${item.atomId}`, {
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
      return this.$api
        .post('/a/base/atom/star', {
          key,
          atom: { star },
        })
        .then(data => {
          this.$meta.eventHub.$emit('atom:star', { key, star: data.star, starCount: data.starCount });
        });
    },
    info_getLabel(id) {
      return this.base_userLabels[id];
    },
    info_getItemMetaMedia(avatar) {
      return this.$meta.util.combineAvatarUrl(avatar, 16);
    },
    info_checkEnableComment(item) {
      // 0. atomStage 0 for workflow
      if (item.atomStage === 0) return true;
      // 1. config
      const configComment = this.layout.configFull.info.comment;
      if (configComment === true || configComment === false) return configComment;
      // 2. meta
      const atomClassBase = this.getAtomClass(this.base.atomClass);
      return atomClassBase.comment !== false;
    },
    info_checkEnableAttachment(/* item*/) {
      // 1. config
      const configAttachment = this.layout.configFull.info.attachment;
      if (configAttachment === true || configAttachment === false) return configAttachment;
      // 2. meta
      const atomClassBase = this.getAtomClass(this.base.atomClass);
      return atomClassBase.attachment !== false;
    },
    info_renderActionsLeft() {
      if (!this.base_ready) return;
      const item = this.base.item;
      const children = [];
      // comment
      if (this.info_checkEnableComment(item)) {
        children.push(
          <eb-link
            key="actionsLeft:comment"
            iconF7="::comment-dots"
            iconBadge={item.commentCount}
            tooltip={this.$text('Comments')}
            eb-href={`/a/basefront/comment/list?atomId=${item.atomId}`}
          ></eb-link>
        );
      }
      // attachment
      if (this.info_checkEnableAttachment(item)) {
        children.push(
          <eb-link
            key="actionsLeft:attachment"
            iconF7="::attachment-line"
            iconBadge={item.attachmentCount}
            tooltip={this.$text('Attachments')}
            eb-href={`/a/basefront/attachment/list?atomId=${item.atomId}`}
          ></eb-link>
        );
      }
      // star
      if (item.atomStage === 1) {
        children.push(
          <eb-link
            key="actionsLeft:star"
            iconF7={item.star ? '::star' : ':outline:star-outline'}
            iconColor={item.star ? 'orange' : 'gray'}
            tooltip={this.$text('UserStar')}
            propsOnPerform={this.info_onStarSwitch}
          ></eb-link>
        );
      }
      // labels
      if (item.atomStage === 1) {
        const labels = item.labels ? JSON.parse(item.labels) : [];
        if (labels.length > 0) {
          for (const label of labels) {
            const _label = this.info_getLabel(label);
            children.push(
              <eb-link
                key={label}
                text={(_label.text || '')[0]}
                style={{ color: _label.color }}
                tooltip={this.$text('UserLabel')}
                propsOnPerform={this.info_onLabel}
              ></eb-link>
            );
          }
        } else {
          children.push(
            <eb-link
              key="actionsLeft:label"
              iconF7=":outline:label-outline"
              tooltip={this.$text('UserLabels')}
              propsOnPerform={this.info_onLabel}
            ></eb-link>
          );
        }
      }
      // ok
      return (
        <div key="actionsLeft:group" class="atom-actions-left-group">
          {children}
        </div>
      );
    },
    info_renderAvatar() {
      const item = this.base.item;
      const children = [];
      let small = false;
      if (item.userIdCreated !== item.userIdUpdated) {
        small = true;
        children.push(
          <img
            key="avatar:one"
            class={`avatar ${small ? 'avatar12' : 'avatar16'}`}
            src={this.info_getItemMetaMedia(item.avatarUpdated)}
            title={item.userName}
          />
        );
      }
      children.push(
        <img
          key="avatar:two"
          class={`avatar ${small ? 'avatar12' : 'avatar24'}`}
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
        children.push(<div key="date:one">{dateUpdated}</div>);
      }
      if (small) {
        children.push(<div key="date:two">{dateCreated}</div>);
      } else {
        children.push(<div key="date:one2">{this.$meta.util.formatDate(item.atomCreatedAt)}</div>);
        children.push(<div key="date:two2">{this.$meta.util.formatTime(item.atomCreatedAt)}</div>);
      }
      return (
        <div key="date" class="info-date">
          {children}
        </div>
      );
    },
    info_getAtomStateColor(item) {
      return item.atomClosed === 0 ? 'orange' : 'gray';
    },
    info_renderFlowNodeState(item) {
      const color = this.info_getAtomStateColor(item);
      if (item._atomStateTitleLocale) {
        return (
          <f7-badge key="_atomStateTitleLocale" color={color}>
            {item._atomStateTitleLocale}
          </f7-badge>
        );
      }
      if (item.flowNodeNameCurrentLocale) {
        return (
          <f7-badge key="flowNodeNameCurrent" color={color}>
            {item.flowNodeNameCurrentLocale}
          </f7-badge>
        );
      }
      return null;
    },
    info_renderActionsRight() {
      if (!this.base_ready) return;
      const item = this.base.item;
      const children = [];
      // atom closed
      if (item.atomStage === 0 && item.atomClosed === 1) {
        children.push(
          <f7-badge key="atomClosed" color="orange">
            {this.$text('Closed')}
          </f7-badge>
        );
      }
      // flow
      const domFlowNodeState = this.info_renderFlowNodeState(item);
      if (domFlowNodeState) {
        children.push(domFlowNodeState);
      }
      // avatar
      children.push(this.info_renderAvatar());
      // date
      children.push(this.info_renderDate());
      // ok
      return children;
    },
  },
};
