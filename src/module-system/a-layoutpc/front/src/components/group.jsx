export default {
  props: {
    groupId: {
      type: String,
    },
    views: {
      type: Array,
    },
    viewsPopup: {
      type: Array,
    },
  },
  data() {
    return {
      viewPopupIndex: 10000,
    };
  },
  computed: {
    groups() {
      return this.$parent.$parent.$parent;
    },
    layout() {
      return this.groups.layout;
    },
    size() {
      return this.layout.size;
    },
  },
  methods: {
    onViewReady(view, viewPopup) {
      // view
      const _view = this.getView(view.id, viewPopup);
      // route
      this.$meta.vueLayout._patchRouter.loadRouteComponent(_view.url, routeComponent => {
        if (!routeComponent) throw new Error(`not found route: ${_view.url}`);
        // width
        const meta = routeComponent.meta;
        const sizeWill = (meta && meta.size) || 'small';
        const sizeFixed = (meta && meta.sizeFixed) || false;
        // title
        let title;
        const viewIndex = parseInt(this.$$(view.$el).data('index'));
        if (viewIndex === 0) {
          title = meta && meta.title;
          if (title) title = this.$text(title);
        }
        // size
        _view.sizeWill = sizeWill;
        _view.sizeFixed = sizeFixed;
        // reLayout
        this.reLayout();
        // callback must not be null
        _view.callback({ view, title });
        delete _view.callback;
      });
    },
    resize() {
      this.$nextTick(() => {
        this._reLayout();
      });
    },
    reLayout() {
      this.$nextTick(() => {
        this._reLayout();
      });
    },
    _combineViewSize(view, indexCurrent, viewPopup) {
      const views = this._getViews(viewPopup);
      if (viewPopup) return this._combineViewSize_popup(view);
      return this._combineViewSize_tile(views, view, indexCurrent);
    },
    _combineViewSize_popup(view) {
      // viewInfo
      const viewInfo = this._combineViewSize_popup_viewInfo(view);
      // viewSizeExtent
      const viewSizeExtent = this._combineViewSize_popup_viewSizeExtent(view, viewInfo);
      // ok
      return { ...viewInfo, viewSizeExtent };
    },
    _combineViewSize_popup_viewSizeExtent(view, viewInfo) {
      //
      const sizeSpacing = this.layout.sizeSpacing;
      const widthReal = this.size.width - sizeSpacing * 2;
      const heightReal = this.size.main;
      //
      const { viewSize, maximize } = viewInfo;
      //
      let width;
      let height;
      if (maximize) {
        width = widthReal;
        height = heightReal;
      } else {
        width = this.size[viewSize];
        height = heightReal - this.layout.sizeSpacingPopup * 2;
      }
      return { width, height };
    },
    _combineViewSize_popup_viewInfo(view) {
      // viewSizeWill
      const viewSizeWill = this._combineViewSize_sizeWill_adjust(view.sizeWill);
      // viewSize
      let viewSize;
      let maximize;
      let canMaximize;
      let canRestore;
      // maximize
      if (view.maximize) {
        viewSize = this.size.enoughLarge ? 'large' : this.size.enoughMedium ? 'medium' : 'small';
        maximize = true;
        canMaximize = false;
        canRestore = this.$meta.util.compareViewSize(viewSize, viewSizeWill) > 0;
      } else {
        // normal
        viewSize = viewSizeWill;
        maximize =
          viewSize === 'large' ||
          (viewSize === 'medium' && !this.size.enoughLarge) ||
          (viewSize === 'small' && !this.size.enoughMedium);
        canMaximize = !maximize;
        canRestore =
          (viewSize === 'medium' && this.size.enoughLarge) || (viewSize === 'small' && this.size.enoughMedium);
      }
      return { viewSize, maximize, canMaximize, canRestore };
    },
    _combineViewSize_tile_sizeWill(views, view, indexCurrent) {
      let sizeWill = view.sizeWill;
      const sizeFixed = view.sizeFixed;
      // check if fixed
      if (sizeFixed) return sizeWill;
      // try
      if ((sizeWill === 'small' || sizeWill === 'medium') && views.length === 1) {
        sizeWill = 'large';
      } else if (
        sizeWill === 'small' &&
        views.length === 2 &&
        indexCurrent === 0 &&
        views[indexCurrent + 1].sizeWill === 'small' &&
        this.layout.size.enoughLarge
      ) {
        sizeWill = 'medium';
      } else if (
        sizeWill === 'small' &&
        views.length >= 2 &&
        indexCurrent === views.length - 1 &&
        views[indexCurrent - 1].sizeWill !== 'small' &&
        !this.layout.size.enoughLarge &&
        this.layout.size.enoughMedium
      ) {
        sizeWill = 'medium';
      } else if (
        sizeWill === 'medium' &&
        views.length >= 2 &&
        indexCurrent === views.length - 1 &&
        views[indexCurrent - 1].sizeWill !== 'small' &&
        this.layout.size.enoughLarge
      ) {
        sizeWill = 'large';
      } else if (
        sizeWill === 'large' &&
        views.length > indexCurrent + 1 &&
        views[indexCurrent + 1].sizeWill === 'small'
      ) {
        sizeWill = 'medium';
      }
      return sizeWill;
    },
    _combineViewSize_tile(views, view, indexCurrent) {
      // sizeWill
      const sizeWill = this._combineViewSize_tile_sizeWill(views, view, indexCurrent);
      // adjust
      const viewSize = this._combineViewSize_sizeWill_adjust(sizeWill);
      // viewSizeExtent
      const viewSizeExtent = {
        width: this.size[viewSize],
        height: this.size.main,
      };
      return { viewSize, viewSizeExtent };
    },
    _combineViewSize_sizeWill_adjust(sizeWill) {
      // adjust
      if (sizeWill === 'large') {
        return this.layout.size.enoughLarge ? 'large' : this.layout.size.enoughMedium ? 'medium' : 'small';
      }
      if (sizeWill === 'medium') {
        return this.layout.size.enoughMedium ? 'medium' : 'small';
      }
      return 'small';
    },
    _reLayout() {
      this._reLayout_tile(this.views);
      this._reLayout_popup(this.viewsPopup);
    },
    _reLayout_popup(views) {
      const sizeSpacing = this.layout.sizeSpacing;
      const widthReal = this.size.width - sizeSpacing * 2;
      // sidebar
      const sidebarLeft = this.layout._sidebarWidth('left');
      // loop
      for (let i = views.length - 1; i >= 0; i--) {
        const view = this.$refs[views[i].id];
        // viewSize
        const { viewSizeExtent, maximize } = this._combineViewSize(views[i], i, true);
        let left;
        let top;
        if (maximize) {
          left = sizeSpacing;
          top = 0;
        } else {
          left = (widthReal - viewSizeExtent.width) / 2 + sizeSpacing;
          top = this.layout.sizeSpacingPopup;
        }
        // style
        const newStyle = {
          left: `${left + sidebarLeft}px`,
          top: `${top}px`,
        };
        this.$$(view.$el).css(newStyle);
      }
    },
    _reLayout_tile(views) {
      // space
      let space = this.size.width;
      let spacing = 0;
      for (let i = views.length - 1; i >= 0; i--) {
        // width
        const { viewSizeExtent } = this._combineViewSize(views[i], i, false);
        const width = viewSizeExtent.width;
        // space
        const space2 = space - width - spacing;
        if (space2 >= 0) {
          space = space2;
          spacing = this.layout.sizeSpacing;
        } else {
          break;
        }
      }
      // sidebar
      const sidebarLeft = this.layout._sidebarWidth('left');

      // left
      let left = parseInt(this.size.width - space / 2);
      spacing = 0;
      for (let i = views.length - 1; i >= 0; i--) {
        const view = this.$refs[views[i].id];
        // width
        const { viewSizeExtent } = this._combineViewSize(views[i], i, false);
        const width = viewSizeExtent.width;
        // space
        left -= width + spacing;
        spacing = this.layout.sizeSpacing;
        // check
        if (left >= 0) {
          const newStyle = {
            left: `${left + sidebarLeft}px`,
          };
          this.$$(view.$el).css(newStyle);
          this.$$(view.$el).removeClass('view-hide');
        } else {
          this.$$(view.$el).addClass('view-hide');
        }
      }
    },
    __getViewIndex(viewId, viewPopup) {
      const views = this._getViews(viewPopup);
      return views.findIndex(item => item.id === viewId);
    },
    onViewTitle(viewId, data, viewPopup) {
      if (viewPopup) return;
      const viewIndex = this.__getViewIndex(viewId, viewPopup);
      if (viewIndex === 0) {
        this.groups.onViewTitle(this.groupId, data.title);
      }
    },
    getViewInstance(viewId /* , viewPopup*/) {
      return this.$refs[viewId];
    },
    getView(viewId, viewPopup) {
      const views = this._getViews(viewPopup);
      return views.find(item => item.id === viewId);
    },
    _getViews(viewPopup) {
      return viewPopup ? this.viewsPopup : this.views;
    },
    _renderView({ index, view, viewPopup }) {
      const { viewSize, viewSizeExtent } = this._combineViewSize(view, index, viewPopup);
      // attrs
      const _viewAttrs = {
        id: view.id,
        name: view.id,
        init: false,
        pushState: false,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
        'data-index': index,
        'data-size': viewSize,
      };
      // props
      const _viewProps = {
        size: viewSize,
        sizeExtent: viewSizeExtent,
      };
      // style
      const _viewStyle = {
        width: `${viewSizeExtent.width}px`,
      };
      if (viewPopup) {
        _viewStyle.height = `${viewSizeExtent.height}px`;
        _viewStyle.zIndex = this.viewPopupIndex + index + '';
      }
      // events
      const _viewEvents = {
        'view:ready': view => {
          this.onViewReady(view, viewPopup);
        },
        'view:title': data => {
          this.onViewTitle(view.id, data, viewPopup);
        },
      };
      const _classView = viewPopup ? 'eb-layout-popup-view' : 'eb-layout-group-view';
      const staticClass = `${_classView} eb-layout-view ${this.layout._combineViewSizeClass(viewSize)}`;
      return (
        <eb-view
          ref={view.id}
          id={view.id}
          key={view.id}
          staticClass={staticClass}
          attrs={_viewAttrs}
          props={_viewProps}
          style={_viewStyle}
          on={_viewEvents}
        ></eb-view>
      );
    },
    _renderViews({ viewPopup }) {
      const views = this._getViews(viewPopup);
      const children = [];
      for (let index = 0; index < views.length; index++) {
        const view = views[index];
        children.push(this._renderView({ index, view, viewPopup }));
      }
      return children;
    },
  },
  render() {
    return (
      <div class="eb-layout-views-container">
        <div staticClass="eb-layout-views">{this._renderViews({ viewPopup: false })}</div>
        <div staticClass="eb-layout-views eb-layout-views-popup">{this._renderViews({ viewPopup: true })}</div>
      </div>
    );
  },
};
