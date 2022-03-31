export default {
  data() {
    return {};
  },
  methods: {
    info_renderActionsLeft() {
      if (!this.base_ready) return;
      const item = this.base.item;
      const children = [];
      // comment
      if (item.atomStage === 0 || this.base.config.render.item.info.comment) {
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
      if (this.base.config.render.item.info.attachment) {
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
                text={_label.text}
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
      return children;
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
      if (item.atomStage === 0 && item.flowNodeNameCurrentLocale) {
        children.push(
          <f7-badge key="flowNodeNameCurrent" color="orange">
            {item.flowNodeNameCurrentLocale}
          </f7-badge>
        );
      }
      // avatar
      children.push(this.info_renderAvatar());
      // date
      children.push(this.info_renderDate());
      // ok
      return children;
    },
    actions_render() {
      if (!this.base_ready) return null;
      const children = [];
      // layout button before save
      const actionLayout = this.actions_findAction('layout');
      if (actionLayout) {
        const actionName = 'layout';
        const actionIcon = '::view-list';
        children.push(
          <eb-link
            key={actionName}
            ref="buttonLayout"
            iconF7={actionIcon}
            tooltip={this.$text('Layout')}
            propsOnPerform={event => this.actions_onAction(event, actionName)}
          ></eb-link>
        );
      }
      // only show on draft
      const atomClosed = this.base.item.atomClosed === 1;
      const actionWrite = this.actions_findAction('write');
      // support simple
      if (actionWrite && this.base.item.atomStage === this.base.item.atomSimple && !atomClosed) {
        const actionIcon = this.container.mode === 'edit' ? '::save' : '::edit';
        const actionName = this.container.mode === 'edit' ? 'save' : 'write';
        const actionTitle = this.container.mode === 'edit' ? 'Save' : 'Edit';
        children.push(
          <eb-link
            key={actionName}
            ref="buttonSave"
            iconF7={actionIcon}
            tooltip={this.$text(actionTitle)}
            propsOnPerform={event => this.actions_onAction(event, actionName)}
          ></eb-link>
        );
      }
      // submit
      if (actionWrite && this.base.item.atomStage === 0 && !atomClosed) {
        const actionName = 'submit';
        children.push(
          <eb-link
            key={actionName}
            ref="buttonSubmit"
            iconF7="::done"
            tooltip={this.$text('Submit')}
            propsOnPerform={event => this.actions_onAction(event, actionName)}
          ></eb-link>
        );
      }
      //
      if (this.actions_listPopover) {
        children.push(
          <f7-link key="actionsPopover" iconF7="::more-horiz" popover-open={`#${this.actions.popoverId}`}></f7-link>
        );
      }
      //
      return children;
    },
  },
};
