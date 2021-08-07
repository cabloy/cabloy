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
    item_getMetaFlags(item) {
      let flags = (item._meta && item._meta.flags) || [];
      if (!Array.isArray(flags)) flags = flags.split(',');
      if (item.atomDisabled) {
        flags = [this.$text('Disabled')].concat(flags);
      }
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
    item_getActionTitle(action, item) {
      return this.layoutManager.getActionTitle(action, item);
    },
    item_renderContextMenu(item, mode) {
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
            <f7-icon slot="media" material={item.star ? 'star_border' : 'star'}></f7-icon>
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
            <f7-icon slot="media" material="label"></f7-icon>
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
          const _action = this.layoutManager.getAction(action);
          let domActionTitle;
          if (mode === 'menu' || (!mode && this.$device.desktop)) {
            domActionTitle = <div slot="title">{this.item_getActionTitle(action, item)}</div>;
          }
          domActions.push(
            <div key={action.id} color={this.item_getActionColor(action, index)} propsOnPerform={event => this.item_onAction(event, item, action)}>
              <f7-icon slot="media" material={_action.icon.material}></f7-icon>
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
    item_renderMedia(item, className) {
      return <img class={className || 'avatar avatar24'} src={this.item_getMetaMedia(item)} />;
    },
  },
};
