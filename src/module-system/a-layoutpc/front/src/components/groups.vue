<script>
import Group from './group.vue';

export default {
  components: {
    ebGroup: Group,
  },
  render(c) {
    const children = [];
    for (const group of this.groups) {
      const _group = c('eb-group', {
        ref: group.id,
        staticClass: 'eb-layout-views',
        props: { groupId: group.id, views: group.views },
      });
      children.push(
        c(
          'f7-tab',
          {
            key: group.id,
            staticClass: `eb-layout-group${group.scene ? ` eb-layout-scene eb-layout-scene-${group.scene}` : ''}`,
            attrs: { id: group.id, 'data-groupId': group.id },
            on: { 'tab:show': this.onTabShow },
          },
          [_group]
        )
      );
    }
    return c('f7-tabs', { staticClass: 'eb-layout-groups' }, children);
  },
  data() {
    return {
      groupIdCurrent: 0,
    };
  },
  computed: {
    layout() {
      return this.$parent;
    },
    header() {
      return this.layout.$refs.header;
    },
    groups() {
      return this.layout.groups;
    },
  },
  methods: {
    reLayout(groupId) {
      this.$refs[groupId].reLayout();
    },
    resize() {
      for (const group of this.groups) {
        this.$refs[group.id].resize();
      }
    },
    getView(groupId, viewId) {
      return this.$refs[groupId].getView(viewId);
    },
    onTabShow(el) {
      this.$nextTick(() => {
        const groupId = this.$$(el).data('groupId');
        const tabLink = this.layout.$refs.header.$refs.tabs.$refs[groupId];
        if (tabLink) {
          tabLink.$el.scrollIntoView(false);
        }
      });
    },
    getGroup({ id, url }) {
      if (id) return this.groups.find(group => group.id === id);
      return this.groups.find(group => group.url === url);
    },
    createView({ ctx, groupId, groupForceNew, url, scene, sceneOptions, options }) {
      if (!options) options = {};
      return new Promise(resolve => {
        // group
        let group = groupForceNew ? null : this.getGroup({ id: groupId, url });
        if (!group) {
          group = {
            id: this.$meta.util.nextId('layoutgroup'),
            url,
            title: '',
            scene,
            sceneOptions,
            views: [],
          };
          if (sceneOptions && sceneOptions.name === 'home') {
            this.groups.unshift(group);
          } else {
            this.groups.push(group);
          }
        }
        // view
        if (group.url === url && group.views.length > 0 && !options.reloadGroup) {
          // exists
          this.switchGroup(group.id);
          resolve(null);
        } else {
          let viewIndex = -1;
          if (ctx && ctx.$view) {
            viewIndex = parseInt(this.$$(ctx.$view.$el).data('index'));
            if (viewIndex >= group.views.length - 1) {
              viewIndex = -1;
            }
          }
          if (viewIndex === -1 && !options.reloadGroup) {
            // new view
            group.views.push({
              id: this.$meta.util.nextId('layoutgroupview'),
              url,
              sizeWill: 'small',
              sizeFixed: false,
              callback: ({ view, title }) => {
                // title
                if (title) group.title = title;
                this.$nextTick(() => {
                  this.switchGroup(group.id);
                  resolve({ view, options: null });
                });
              },
            });
          } else {
            // remove last views
            const viewIndexNew = viewIndex + 1;
            this._removeNextViews(group.id, viewIndexNew + 1)
              .then(() => {
                // return next view
                const view = this.getView(group.id, group.views[viewIndexNew].id);
                const _options = { reloadAll: true };
                if (options.reloadGroup) {
                  _options.reloadCurrent = true;
                }
                resolve({ view, options: _options });
              })
              .catch(() => {
                // return null
                resolve(null);
              });
          }
        }
      });
    },
    switchGroup(groupId) {
      this.$f7.tab.show(`#${groupId}`);
      this.groupIdCurrent = groupId;
    },
    _getGroupIndex(groupId) {
      return this.groups.findIndex(group => group.id === groupId);
    },
    _getGroupAndIndex(groupId) {
      const groupIndex = this._getGroupIndex(groupId);
      if (groupIndex === -1) return [null, -1];
      return [this.groups[groupIndex], groupIndex];
    },
    onViewTitle(groupId, title) {
      if (title) {
        const group = this.groups.find(group => group.id === groupId);
        group.title = title;
      }
    },
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
        const __appHome = this.$meta.util.getProperty(groupCurrent, 'sceneOptions.appHome');
        if (this.groups.length === 0 && !__appHome) {
          this.layout.openHome();
        }
      });
    },
    async closeView(view, options) {
      // options
      options = options || {};
      const disableCheckDirty = options.disableCheckDirty;
      // remove next views
      const $view = this.$$(view.$el);
      const viewIndex = parseInt($view.data('index'));
      const groupId = $view.parents('.eb-layout-group').data('groupId');
      const group = this.getGroup({ id: groupId });
      try {
        await this._removeNextViews(groupId, viewIndex + 1);
        if (!disableCheckDirty) {
          await this._viewDirtyConfirm(groupId, view.id);
        }
        $view.addClass('eb-transition-close').animationEnd(() => {
          group.views.splice(viewIndex, 1);
          if (group.views.length === 0) {
            this.removeGroup(groupId);
          } else {
            this.reLayout(groupId);
          }
        });
      } catch (err) {
        // do nothing
      }
    },
    async closeGroup(groupId, onlyRemove) {
      try {
        await this._removeNextViews(groupId, 0);
        this.removeGroup(groupId, onlyRemove);
      } catch (err) {}
    },
    async refreshGroup(groupId) {
      try {
        const group = this.getGroup({ id: groupId });
        if (!group) return;
        const view = group.views[0];
        await this._viewDirtyConfirm(group.id, view.id);
        this.layout.navigate(group.url, {
          groupId,
          reloadGroup: true,
        });
      } catch (err) {}
    },
    async _removeNextViews(groupId, viewIndexStart) {
      const group = this.getGroup({ id: groupId });
      // from right to left
      for (let i = group.views.length - 1; i >= 0; i--) {
        if (i >= viewIndexStart) {
          const view = group.views[i];
          await this._viewDirtyConfirm(group.id, view.id);
          group.views.splice(i, 1);
          // for show the viewDirtyConfirm dialog
          this.reLayout(groupId);
        }
      }
    },
    async _viewDirtyConfirm(groupId, viewId) {
      const viewVue = this.getView(groupId, viewId);
      const dirty = viewVue.getViewDirty && viewVue.getViewDirty();
      if (dirty) {
        // will throw error if cancelled
        await viewVue.viewDirtyConfirm();
      }
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
        const viewVue = this.getView(groupId, view.id);
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
</script>
