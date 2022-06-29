export default {
  methods: {
    navbar_findViewDom(ctx) {
      const $el = ctx.$$(ctx.$el);
      return $el.parents('.eb-layout-view');
    },
    navbar_findViewInfo(ctx) {
      const $view = this.navbar_findViewDom(ctx);
      const groupId = $view.parents('.eb-layout-group').data('groupId');
      const viewId = $view.attr('id');
      const viewPopup = $view.is('.eb-layout-popup-view');
      const viewTile = $view.is('.eb-layout-group-view');
      const viewIndex = parseInt($view.data('index'));
      //
      let group;
      let groupInstance;
      let view;
      if (groupId) {
        group = this.groupsInstance && this.groupsInstance.getGroup({ id: groupId });
        groupInstance = this.groupsInstance && this.groupsInstance.getGroupInstance(groupId);
        view = groupInstance && groupInstance.getView(viewId, viewPopup);
      }
      //
      return {
        $view,
        view,
        viewId,
        viewPopup,
        viewTile,
        viewIndex,
        groupId,
        group,
        groupInstance,
      };
    },
    backLink(ctx) {
      let backLink = false;
      const routeDiff = this.$meta.util.viewRouterDid(ctx.$view) ? 2 : 1;
      if (!this.$meta.util.historyUrlEmpty(ctx.$f7router.history[ctx.$f7router.history.length - routeDiff])) {
        backLink = true;
      } else {
        const viewInfo = this.navbar_findViewInfo(ctx);
        if (viewInfo.viewTile && viewInfo.viewIndex > 0) {
          backLink = true;
        }
      }
      return backLink;
    },
    closeLink(ctx) {
      const { viewPopup } = this.navbar_findViewInfo(ctx);
      return viewPopup;
    },
    sizeLink(ctx) {
      const { view, viewPopup, viewIndex, groupInstance } = this.navbar_findViewInfo(ctx);
      if (!viewPopup) return false;
      // viewSize
      const { canMaximize, canRestore } = groupInstance._combineViewSize(view, viewIndex, true);
      if (canMaximize) return 'maximize';
      if (canRestore) return 'restore';
      return false;
    },
    onCloseClick(ctx) {
      const { view, viewPopup } = this.navbar_findViewInfo(ctx);
      if (!viewPopup) return false;
      this.groupsInstance.closeView(view);
    },
    onSizeClick(ctx) {
      const { view, viewPopup, groupInstance } = this.navbar_findViewInfo(ctx);
      if (!viewPopup) return false;
      //
      view.maximize = !view.maximize;
      groupInstance.reLayout();
    },
  },
};
