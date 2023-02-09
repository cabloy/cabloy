export default {
  methods: {
    async item_onAction(event, item, action) {
      const _action = this.getAction(action);
      if (!_action) return;
      await this.$meta.util.performAction({ ctx: this, action: _action, item });
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    async item_onActionView(event, item) {
      let actionName = this.$meta.util.getProperty(this.container.params, 'actionOnClick');
      if (!actionName) {
        if (item.atomStage === 0 && item.atomClosed === 0 && item.atomFlowId === 0) {
          actionName = 'write';
        } else {
          actionName = 'read';
        }
      }
      return await this.item_onAction(event, item, {
        module: item.module,
        atomClassName: item.atomClassName,
        name: actionName,
      });
    },
    item_getAtomName(item) {
      return item.atomNameLocale || item.atomName;
    },
    item_getMetaMedia(item, avatarFieldName) {
      let media;
      if (!avatarFieldName) {
        media = (item._meta && item._meta.media) || item.avatar;
      } else {
        media = item[avatarFieldName];
      }
      return this.$meta.util.combineAvatarUrl(media, 24);
    },
    item_getMetaMediaLabel(item) {
      const mediaLabel = (item._meta && item._meta.mediaLabel) || item.userName;
      return mediaLabel;
    },
    item_getMetaSummary(item) {
      const arr = [];
      // atomClass
      if (!this.container.atomClass) {
        const atomClass = this.getAtomClass({
          module: item.module,
          atomClassName: item.atomClassName,
        });
        if (atomClass) {
          arr.push(atomClass.titleLocale);
        }
      }
      // resourceType
      const resourceType = item.resourceTypeLocale;
      if (resourceType) {
        arr.push(resourceType);
      }
      // atomCategoryName
      const formCategory = this.$meta.util.getProperty(this.filter.data, 'form.category');
      const atomCategoryName = item.atomCategoryNameLocale || item.atomCategoryName;
      if (!formCategory && atomCategoryName) {
        arr.push(atomCategoryName);
      }
      // summary
      const summary = (item._meta && item._meta.summary) || '';
      if (summary) {
        arr.push(summary);
      }
      // join
      return arr.join(' / ');
    },
    item_getMetaFlags(item) {
      let flags = (item._meta && item._meta.flags) || [];
      if (!Array.isArray(flags)) flags = flags.split(',');
      return flags;
    },
    item_getLabel(id) {
      if (!this.base_userLabels) return null;
      return this.base_userLabels[id];
    },
    item_getActionColor(action, index) {
      if (index === 0) return 'orange';
      else if (index === 1) return 'red';
      return 'blue';
    },
    item_getActionTitle(action, item) {
      return this.getActionTitle(action, item);
    },
    item_renderContextMenu(item, mode) {
      // return <eb-actions-bar></eb-actions-bar>;
      // domLeft
      let domLeft;
      if (item && item.atomStage === 1) {
        // star
        let domLeftStarTitle;
        if (mode === 'menu' || (!mode && this.$device.desktop)) {
          domLeftStarTitle = <div slot="title">{this.$text(item.star ? 'Unstar' : 'UserStar')}</div>;
        }
        const domLeftStar = (
          <div color="teal" propsOnPerform={event => this.star_onSwitch(event, item)}>
            <f7-icon
              slot="media"
              color={item.star ? 'orange' : ''}
              f7={item.star ? '::star' : ':outline:star-outline'}
            ></f7-icon>
            {domLeftStarTitle}
          </div>
        );
        // label
        let domLeftLabelTitle;
        if (mode === 'menu' || (!mode && this.$device.desktop)) {
          domLeftLabelTitle = <div slot="title">{this.$text('UserLabels')}</div>;
        }
        const domLeftLabel = (
          <div color="blue" propsOnPerform={event => this.labels_onClick(event, item)}>
            <f7-icon slot="media" f7=":outline:label-outline"></f7-icon>
            {domLeftLabelTitle}
          </div>
        );
        domLeft = (
          <div slot="left">
            {domLeftStar}
            {domLeftLabel}
          </div>
        );
      }
      // domRight
      const domActions = [];
      if (item && item._actions) {
        for (let index in item._actions) {
          index = parseInt(index);
          const action = item._actions[index];
          const _action = this.getAction(action);
          let domActionTitle;
          if (mode === 'menu' || (!mode && this.$device.desktop)) {
            domActionTitle = <div slot="title">{this.item_getActionTitle(action, item)}</div>;
          }
          domActions.push(
            <div
              key={action.id}
              color={this.item_getActionColor(action, index)}
              propsOnPerform={event => this.item_onAction(event, item, action)}
            >
              <f7-icon
                slot="media"
                material={_action.icon && _action.icon.material}
                f7={_action.icon && _action.icon.f7}
              ></f7-icon>
              {domActionTitle}
            </div>
          );
        }
      }
      const domRight = (
        <div slot="right" ready={item && !!item._actions}>
          {domActions}
        </div>
      );
      return (
        <eb-context-menu mode={mode}>
          {domLeft}
          {domRight}
        </eb-context-menu>
      );
    },
    item_renderMedia(item, className, avatarFieldName) {
      return <img class={className || 'avatar avatar24'} src={this.item_getMetaMedia(item, avatarFieldName)} />;
    },
    item_renderStats(item) {
      const children = [];
      if (item.star > 0) {
        children.push(
          <span key="stat_star">
            <f7-icon f7="::star" size="14" color="orange"></f7-icon>
          </span>
        );
      }
      if (item.attachmentCount > 0) {
        let domAttachmentCount;
        if (item.attachmentCount > 1) {
          domAttachmentCount = <sub class="text-color-orange">{item.attachmentCount}</sub>;
        }
        children.push(
          <span key="stat_attachmentCount_icon">
            <f7-icon f7="::attachment-line" size="14" color="orange"></f7-icon>
            {domAttachmentCount}
          </span>
        );
      }
      if (item.commentCount > 0) {
        let domCommentCount;
        if (item.commentCount > 1) {
          domCommentCount = <sub class="text-color-orange">{item.commentCount}</sub>;
        }
        children.push(
          <span key="stat_commentCount_icon">
            <f7-icon f7="::comment-dots" size="14" color="orange"></f7-icon>
            {domCommentCount}
          </span>
        );
      }
      return children;
    },
    item_getAtomStateColor(item) {
      return item.atomClosed === 0 ? 'orange' : 'gray';
    },
    item_renderFlowNodeState(item) {
      const color = this.item_getAtomStateColor(item);
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
    item_renderMetaFlags(item) {
      const domMetaFlags = [];
      // flow
      const domFlowNodeState = this.item_renderFlowNodeState(item);
      if (domFlowNodeState) {
        domMetaFlags.push(domFlowNodeState);
      }
      // flags
      const itemFlags = this.item_getMetaFlags(item);
      for (const flag of itemFlags) {
        domMetaFlags.push(<f7-badge key={flag}>{flag}</f7-badge>);
      }
      return domMetaFlags;
    },
    item_renderLabels(item) {
      const domLabels = [];
      if (item.labels && this.base_userLabels) {
        for (const label of JSON.parse(item.labels)) {
          const _label = this.item_getLabel(label);
          domLabels.push(
            <f7-badge key={label} style={{ backgroundColor: _label.color }}>
              {(_label.text || '')[0]}
            </f7-badge>
          );
        }
      }
      return domLabels;
    },
  },
};
