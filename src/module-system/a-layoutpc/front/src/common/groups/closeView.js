export default {
  methods: {
    async closeView(view, options) {
      // options
      options = options || {};
      // remove next views
      const viewInfo = this.layout.navbar_findViewInfo(view);
      if (viewInfo.viewPopup) {
        await this._closeView_popup(viewInfo, options);
      } else {
        await this._closeView_tile(viewInfo, options);
      }
    },
    async _closeView_popup(viewInfo, options) {
      const disableCheckDirty = options.disableCheckDirty;
      const { $view, viewId, viewIndex, groupId, group } = viewInfo;
      try {
        // only close current view
        if (!disableCheckDirty) {
          await this._viewDirtyConfirm(groupId, viewId);
        }
        $view.addClass('eb-transition-close').animationEnd(() => {
          group.viewsPopup.splice(viewIndex, 1);
          this.reLayout(groupId);
        });
      } catch (err) {
        // do nothing
      }
    },
    async _closeView_tile(viewInfo, options) {
      const disableCheckDirty = options.disableCheckDirty;
      const { $view, viewId, viewIndex, groupId, group } = viewInfo;
      try {
        await this._removeNextViews(groupId, viewIndex + 1);
        if (!disableCheckDirty) {
          await this._viewDirtyConfirm(groupId, viewId);
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
      const viewVue = this.getViewInstance(groupId, viewId);
      const dirty = viewVue.getViewDirty && viewVue.getViewDirty();
      if (dirty) {
        // will throw error if cancelled
        await viewVue.viewDirtyConfirm();
      }
    },
  },
};
