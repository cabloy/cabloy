export default {
  render(c) {
    // pushStateMain: disabled for ios
    const pushStateView = !this.$device.ios;

    const children = [];

    // views
    for (let index = 0; index < this.views.length; index++) {
      const view = this.views[index];
      const _viewAttrs = {
        id: view.id,
        name: view.zIndex + '',
        init: false,
        pushState: pushStateView,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
        'data-zindex': view.zIndex,
        'data-size': this.size,
      };
      children.push(
        c('eb-view', {
          ref: view.id,
          id: view.id,
          key: view.id,
          staticClass: `eb-layout-view ${this.layout._combineViewSizeClass()}`,
          style: {
            zIndex: view.zIndex + '',
          },
          attrs: _viewAttrs,
          props: {
            size: this.size,
            sizeExtent: this.sizeExtent,
          },
          on: {
            'view:ready': view => {
              this.onViewReady(view);
            },
          },
        })
      );
    }
    return c(
      'div',
      {
        staticClass: 'eb-layout-group',
      },
      children
    );
  },
  data() {
    return {
      views: [],
      viewIndex: 10000,
    };
  },
  computed: {
    layout() {
      return this.$parent;
    },
    size() {
      return this.$parent.size;
    },
    sizeExtent() {
      return this.$parent.sizeExtent;
    },
  },
  methods: {
    closeView(view) {
      const $view = this.$$(view.$el);
      $view.addClass('eb-transition-close').animationEnd(() => {
        // remove
        const viewzIndex = parseInt($view.data('zindex'));
        const index = this.views.findIndex(item => item.zIndex === viewzIndex);
        if (index > -1) {
          this.views.splice(index, 1);
          if (this.views.length === 0) {
            // hide group
            this.$$(this.$el).hide();
            // tab show
            if (!this.layout.tabShowed) {
              this.layout.tabShowed = true;
            }
          }
        }
      });
    },
    createView({ ctx, url }) {
      return new Promise(resolve => {
        const _viewIndex = ++this.viewIndex;
        this.views.push({
          id: `layoutview_${_viewIndex}`,
          zIndex: _viewIndex,
          url,
          callback: ({ view }) => {
            this.$nextTick(() => {
              resolve({ view, options: null });
            });
          },
        });
        this.$$(this.$el).show();
      });
    },
    onViewReady(view) {
      // view
      const _view = this.views.find(item => item.id === view.id);
      // route
      this.$meta.vueLayout._patchRouter.loadRoute(_view.url, route => {
        if (!route) throw new Error(`not found route: ${_view.url}`);
        // callback
        _view.callback({ view });
        delete _view.callback;
      });
    },
    getViewInstance(viewId) {
      return this.$refs[viewId];
    },
    _getGroupDirty() {
      for (const view of this.views) {
        const viewVue = this.getViewInstance(view.id);
        const dirty = viewVue && viewVue.getViewDirty && viewVue.getViewDirty();
        if (dirty) return true;
      }
      return false;
    },
  },
};
