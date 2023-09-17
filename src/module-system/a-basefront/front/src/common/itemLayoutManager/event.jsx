export default {
  mounted() {
    this.$meta.eventHub.$on('atom:star', this.event_onStarChanged);
    this.$meta.eventHub.$on('atom:labels', this.event_onLabelsChanged);
    this.$meta.eventHub.$on('atom:action', this.event_onActionChanged);
    this.$meta.eventHub.$on('atom:actions', this.event_onActionsChanged);
    this.$meta.eventHub.$on('comment:action', this.event_onCommentChanged);
    this.$meta.eventHub.$on('attachment:action', this.event_onAttachmentChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atom:star', this.event_onStarChanged);
    this.$meta.eventHub.$off('atom:labels', this.event_onLabelsChanged);
    this.$meta.eventHub.$off('atom:action', this.event_onActionChanged);
    this.$meta.eventHub.$off('atom:actions', this.event_onActionsChanged);
    this.$meta.eventHub.$off('comment:action', this.event_onCommentChanged);
    this.$meta.eventHub.$off('attachment:action', this.event_onAttachmentChanged);
  },
  methods: {
    event_onStarChanged(data) {
      if (!this.base.item || data.key.atomId !== this.container.atomId) return;
      this.base.item.star = data.star;
    },
    event_onLabelsChanged(data) {
      if (!this.base.item || data.key.atomId !== this.container.atomId) return;
      this.base.item.labels = JSON.stringify(data.labels);
    },
    event_onCommentChanged(data) {
      if (!this.base.item || data.atomId !== this.container.atomId) return;
      if (data.action === 'create') this.base.item.commentCount += 1;
      if (data.action === 'delete') this.base.item.commentCount -= 1;
    },
    event_onAttachmentChanged(data) {
      if (!this.base.item || data.atomId !== this.container.atomId) return;
      if (data.action === 'create') this.base.item.attachmentCount += 1;
      if (data.action === 'delete') this.base.item.attachmentCount -= 1;
    },
    async event_onActionChanged(data) {
      // const key = data.key;
      // const atomClass = data.atomClass;
      const action = data.action;
      if (!this.event_checkIfEventActionValid(data)) {
        return;
      }

      if (action.name === 'save' && this.container.mode === 'edit') {
        await this.event_onActionChanged_saveEdit({ data });
        return;
      }

      // create
      if (action.name === 'create') {
        // do nothing
        return;
      }
      // not check delete for draft
      //    for: delete on atom list but not delete on atom when atomClosed=1
      // delete
      if (action.name === 'delete') {
        // not delete if draft
        // if (this.base.item.atomStage !== 0 || this.base.item.atomIdFormal === 0) {
        if (this.base.item.atomStage === 0) {
          // maybe deleted/closed
          if (this.base.item.atomIdFormal === 0) {
            // means should be deleted
            this.base.item = null;
            this.base.notfound = true;
            this.base.ready = false;
            return;
          }
        } else {
          this.base.item = null;
          this.base.notfound = true;
          this.base.ready = false;
          return;
        }
      }
      // others
      await this.base_loadItem();
    },
    async event_onActionChanged_saveEdit({ data }) {
      // from self
      if (data.actionSource === this) {
        // just update time
        if (this.base.item.atomUpdatedAt) {
          this.base.item.atomUpdatedAt = new Date();
        } else {
          this.base.item.updatedAt = new Date();
        }
        return;
      }
      // not dirty
      if (!this.page_getDirty()) {
        await this.base_loadItem();
        return;
      }
      // prompt
      const title = this.base.item.atomNameLocale || this.base.item.atomName;
      try {
        await this.$view.dialog.confirm(this.$text('DataChangedReloadConfirm'), title);
        if (this.page_getDirty()) {
          // only load once when more updates
          await this.base_loadItem();
          this.page_setDirty(false);
        }
      } catch (err) {
        // just update time
        if (this.base.item.atomUpdatedAt) {
          this.base.item.atomUpdatedAt = new Date();
        } else {
          this.base.item.updatedAt = new Date();
        }
      }
    },
    async event_onActionsChanged(data) {
      // const key = data.key;
      // const atomClass = data.atomClass;
      if (!this.event_checkIfEventActionValid(data)) {
        return;
      }

      await this.actions_fetchActions();
    },
    event_checkIfEventActionValid(data) {
      const key = data.key;
      const atomClass = data.atomClass;
      if (!atomClass) throw new Error('Should specify atom class');

      if (!this.base_ready) return false;
      if (
        atomClass.module !== this.base.atomClass.module ||
        atomClass.atomClassName !== this.base.atomClass.atomClassName
      ) {
        return false;
      }
      if (this.base.item.atomId !== key.atomId) return false;
      // ok
      return true;
    },
  },
};
