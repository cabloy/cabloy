export default {
  methods: {
    removeGroup(groupId, onlyRemove) {
      // current
      const index = this._getGroupIndex(groupId);
      const groupCurrent = this.groups[index];
      // next
      let groupIdNext;
      if (this.header.isTabActive(groupId)) {
        if (this.groups.length - 1 > index) {
          groupIdNext = this.groups[index + 1].id;
        } else if (index > 0) {
          groupIdNext = this.groups[index - 1].id;
        }
      }
      // remove
      this.groups.splice(index, 1);
      // only remove
      if (onlyRemove) return;
      // next action
      this.$nextTick(() => {
        // next
        if (groupIdNext) {
          this.switchGroup(groupIdNext);
        }
        // check if appHome
        const appHome = this.$meta.util.getProperty(groupCurrent, 'sceneOptions.appHome');
        if (this.groups.length === 0 && !appHome) {
          this.layout.openHome();
        }
      });
    },
    async closeGroup(groupId, onlyRemove) {
      try {
        // popup
        await this._removeNextViews(groupId, 0, true);
        // tile
        await this._removeNextViews(groupId, 0, false);
        // remove group
        this.removeGroup(groupId, onlyRemove);
      } catch (err) {}
    },
    onbeforeunload() {
      const dirty = this._onbeforeunload_stage_one();
      if (!dirty) return dirty;
      this._onbeforeunload_stage_two();
      return dirty;
    },
    _getGroupDirty(groupId) {
      const [group] = this._getGroupAndIndex(groupId);
      for (const view of group.views) {
        const viewVue = this.getViewInstance(groupId, view.id);
        const dirty = viewVue.getViewDirty && viewVue.getViewDirty();
        if (dirty) return true;
      }
      return false;
    },
    _onbeforeunload_stage_one() {
      // from left to right
      for (const group of this.groups) {
        const dirty = this._getGroupDirty(group.id);
        if (dirty) return true;
      }
      return false;
    },
    async _onbeforeunload_stage_two() {
      // from left to right
      const groupIds = this.groups.map(item => item.id);
      for (const groupId of groupIds) {
        const dirty = this._getGroupDirty(groupId);
        if (dirty) {
          // just switch group
          this.switchGroup(groupId);
          return;
        }
      }
    },
    async closeOtherTabs(groupIdThis) {
      // switch current
      this.switchGroup(groupIdThis);
      // from left to right
      const groupIds = this.groups.map(item => item.id);
      for (const groupId of groupIds) {
        const dirty = this._getGroupDirty(groupId);
        if (groupId !== groupIdThis && !dirty) {
          // close group
          await this.closeGroup(groupId, true);
        }
      }
    },
    async closeTabsToTheRight(groupIdThis) {
      // switch current
      this.switchGroup(groupIdThis);
      // from left to right
      const [, groupIndexThis] = this._getGroupAndIndex(groupIdThis);
      const groupIds = [];
      for (let index = groupIndexThis + 1; index < this.groups.length; index++) {
        groupIds.push(this.groups[index].id);
      }
      for (const groupId of groupIds) {
        const dirty = this._getGroupDirty(groupId);
        if (groupId !== groupIdThis && !dirty) {
          // close group
          await this.closeGroup(groupId, true);
        }
      }
    },
  },
};
