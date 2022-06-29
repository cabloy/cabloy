export default {
  methods: {
    async closeView(view, options) {
      // options
      options = options || {};
      const disableCheckDirty = options.disableCheckDirty;
      // remove next views
      const viewInfo = this.layout.navbar_findViewInfo(view);
      const { $view, viewId, viewIndex, viewPopup, groupId } = viewInfo;
      const views = this._getViews(groupId, viewPopup);
      try {
        // next
        await this._removeNextViews(groupId, viewIndex + 1, viewPopup, options);
        // current
        if (!disableCheckDirty) {
          await this._viewDirtyConfirm(groupId, viewId);
        }
        $view.addClass('eb-transition-close').animationEnd(() => {
          views.splice(viewIndex, 1);
          if (!viewPopup && views.length === 0) {
            this.removeGroup(groupId);
          } else {
            this.reLayout(groupId);
          }
        });
      } catch (err) {
        // do nothing
      }
    },
    async _removeNextViews(groupId, viewIndexStart, viewPopup, options) {
      // options
      options = options || {};
      const disableCheckDirty = options.disableCheckDirty;
      // views
      const views = this._getViews(groupId, viewPopup);
      // from right to left
      for (let i = views.length - 1; i >= 0; i--) {
        if (i >= viewIndexStart) {
          const view = views[i];
          if (!disableCheckDirty) {
            await this._viewDirtyConfirm(groupId, view.id);
          }
          views.splice(i, 1);
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
