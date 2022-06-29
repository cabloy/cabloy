export default {
  methods: {
    async closeView(view, options) {
      // options
      options = options || {};
      const disableCheckDirty = options.disableCheckDirty;
      // remove next views
      const viewInfo = this.layout.navbar_findViewInfo(view);
      console.log(viewInfo);
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
