<script>
import Group from './group.jsx';
import MixinCloseView from '../common/groups/closeView.js';
import MixinCloseGroup from '../common/groups/closeGroup.js';

export default {
  mixins: [MixinCloseView, MixinCloseGroup],
  components: {
    ebGroup: Group,
  },
  render(c) {
    const children = [];
    for (const group of this.groups) {
      const _group = c('eb-group', {
        ref: group.id,
        props: { groupId: group.id, views: group.views, viewsPopup: group.viewsPopup },
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
      this.getGroupInstance(groupId).reLayout();
    },
    resize() {
      for (const group of this.groups) {
        this.getGroupInstance(group.id).resize();
      }
    },
    getViewInstance(groupId, viewId) {
      return this.getGroupInstance(groupId).getViewInstance(viewId);
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
    getGroupInstance(groupId) {
      return this.$refs[groupId];
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
            viewsPopup: [],
          };
          this._addGroup(group);
        }
        // just switch group
        if (group.url === url && group.views.length > 0 && !options.reloadGroup) {
          // exists
          this.switchGroup(group.id);
          resolve(null);
          return;
        }
        // first view
        if (group.views.length === 0) {
          this._createView_newView({ group, viewPopup: false, url, resolve });
          return;
        }
        // reload group
        if (options.reloadGroup) {
          // pageDirty as concerned
          // todo: remove all popups
          // todo: remove all next views
          // todo: reload the first view
          // const _options = { reloadAll: true };
          // if (options.reloadGroup) {
          //   _options.reloadCurrent = true;
          // }
          // resolve({ view, options: _options });
          return;
        }
        // check if viewPopup
        const viewPopup = options.target === '_popup' || this.layout.layoutConfig.viewPopup;
        if (viewPopup) {
          this._createView_popup({ group, ctx, url, options, resolve });
        } else {
          this._createView_tile({ group, ctx, url, options, resolve });
        }
      });
    },
    _createView_popup({ group, ctx, url, options, resolve }) {
      // first view
      if (group.viewsPopup.length === 0) {
        this._createView_newView({ group, viewPopup: true, url, resolve });
        return;
      }
      // target
      const target = options.target;
      if (target === '_view' || target === '_popup') {
        this._createView_newView({ group, viewPopup: true, url, resolve });
        return;
      }
      // navigate on the last view
      const view = this.getViewInstance(group.id, group.viewsPopup[group.viewsPopup.length - 1].id);
      resolve({ view, options: null });
    },
    _createView_tile({ group, ctx, url, options, resolve }) {
      // next view index
      let viewIndex = -1;
      if (ctx && ctx.$view) {
        viewIndex = parseInt(this.$$(ctx.$view.$el).data('index'));
        if (viewIndex >= group.views.length - 1) {
          viewIndex = -1;
        }
      }
      if (viewIndex === -1) {
        // new view
        this._createView_newView({ group, viewPopup: false, url, resolve });
        return;
      }
      // remove last views
      const viewIndexNew = viewIndex + 1;
      this._removeNextViews(group.id, viewIndexNew + 1)
        .then(() => {
          // return next view
          const view = this.getViewInstance(group.id, group.views[viewIndexNew].id);
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
    },
    _createView_newView({ group, viewPopup, url, resolve }) {
      const views = viewPopup ? group.viewsPopup : group.views;
      views.push({
        id: this.$meta.util.nextId('layoutgroupview'),
        url,
        sizeWill: viewPopup ? 'medium' : 'small',
        sizeFixed: false,
        maximize: false,
        viewPopup,
        callback: ({ view, title }) => {
          // title
          if (title) group.title = title;
          this.$nextTick(() => {
            this.switchGroup(group.id);
            resolve({ view, options: null });
          });
        },
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
    _addGroup(group) {
      const appHome = this.$meta.util.getProperty(group, 'sceneOptions.appHome');
      const appKey = this.$meta.util.getProperty(group, 'sceneOptions.appKey');
      // normal
      if (!appHome) {
        this.groups.push(group);
        return;
      }
      // appDefault
      if (this.layout.app_isDefault(appKey)) {
        this.groups.unshift(group);
        return;
      }
      // findLast
      const index = this.groups.findLastIndex(item => {
        const appHome = this.$meta.util.getProperty(item, 'sceneOptions.appHome');
        return !!appHome;
      });
      this.groups.splice(index + 1, 0, group);
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
  },
};
</script>
