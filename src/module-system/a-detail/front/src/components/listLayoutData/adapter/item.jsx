export default {
  methods: {
    async item_onAction(event, item, action) {
      const _action = this.layoutManager.getDetailAction(action);
      if (!_action) return;
      const res = await this.$meta.util.performAction({
        ctx: this.layoutManager,
        action: _action,
        item: {
          item,
          meta: {
            flowTaskId: this.layoutManager.container.flowTaskId,
          },
        },
      });
      this.$meta.util.swipeoutClose(event.target);
      return res;
    },
    async item_onItemClick(event, item) {
      return await this.item_onAction(event, item, {
        module: item.module,
        detailClassName: item.detailClassName,
        name: this.layoutManager.container.mode === 'view' ? 'read' : 'write',
      });
    },
    item_getDetailName(item) {
      return item.detailName;
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
      return (item._meta && item._meta.summary) || '';
      // return (item._meta && item._meta.summary) || item.detailCode;
    },
    item_getMetaFlags(item) {
      let flags = (item._meta && item._meta.flags) || [];
      if (!Array.isArray(flags)) flags = flags.split(',');
      return flags;
    },
    item_getLabel(id) {
      if (!this.layoutManager.base_userLabels) return null;
      return this.layoutManager.base_userLabels[id];
    },
    item_getActionColor(action, index) {
      if (index === 0) return 'orange';
      else if (index === 1) return 'red';
      return 'blue';
    },
    item_getActionTitle(action) {
      return this.layoutManager.getDetailActionTitle(action);
    },
    item_getActions(mode) {
      const actions = this.layoutManager.actions.list;
      if (!actions) return actions;
      if (mode === 'menu' || (!mode && this.$device.desktop)) {
        // show all on menu
        return actions;
      }
      // only read/write/delete
      return actions.filter(item => ['read', 'write', 'delete'].indexOf(item.name) > -1);
    },
    item_renderContextMenu(item, mode) {
      const itemActions = this.item_getActions(mode);
      // domRight
      const domActions = [];
      if (itemActions) {
        for (let index in itemActions) {
          index = parseInt(index);
          const action = itemActions[index];
          const _action = this.layoutManager.getDetailAction(action);
          let domActionTitle;
          if (mode === 'menu' || (!mode && this.$device.desktop)) {
            domActionTitle = <div slot="title">{this.item_getActionTitle(action)}</div>;
          }
          domActions.push(
            <div key={action.code} color={this.item_getActionColor(action, index)} propsOnPerform={event => this.item_onAction(event, item, action)}>
              <f7-icon slot="media" material={_action.icon.material}></f7-icon>
              {domActionTitle}
            </div>
          );
        }
      }
      const domRight = (
        <div slot="right" ready={!!itemActions}>
          {domActions}
        </div>
      );
      return <eb-context-menu mode={mode}>{domRight}</eb-context-menu>;
    },
    item_renderMedia(item, className) {
      return <img class={className || 'avatar avatar24'} src={this.item_getMetaMedia(item)} />;
    },
    item_renderStats(item) {
      const children = [];
      if (item.star > 0) {
        children.push(<span key="stat_star">⭐</span>);
      }
      if (item.attachmentCount > 0) {
        children.push(<span key="stat_attachmentCount_icon">🧷</span>);
      }
      if (item.attachmentCount > 1) {
        children.push(<span key="stat_attachmentCount_value">{`${item.attachmentCount}`}</span>);
      }
      if (item.commentCount > 0) {
        children.push(<span key="stat_commentCount_icon">💬</span>);
      }
      if (item.commentCount > 1) {
        children.push(<span key="stat_commentCount_value">{`${item.commentCount}`}</span>);
      }
      return children;
    },
    item_renderMetaFlags(item) {
      const domMetaFlags = [];
      const itemFlags = this.item_getMetaFlags(item);
      for (const flag of itemFlags) {
        domMetaFlags.push(<f7-badge key={flag}>{flag}</f7-badge>);
      }
      return domMetaFlags;
    },
    item_renderLabels(item) {
      const domLabels = [];
      if (item.labels && this.layoutManager.base_userLabels) {
        for (const label of JSON.parse(item.labels)) {
          const _label = this.item_getLabel(label);
          domLabels.push(
            <f7-badge key={label} style={{ backgroundColor: _label.color }}>
              {_label.text}
            </f7-badge>
          );
        }
      }
      return domLabels;
    },
  },
};
