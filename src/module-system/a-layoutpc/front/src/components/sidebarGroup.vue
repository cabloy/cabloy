<script>
export default {
  render(c) {
    const children = [];
    // views
    for (let index = 0; index < this.views.length; index++) {
      const view = this.views[index];
      const viewSize = this.sidebar.viewSize;
      const viewSizeExtent = this.sidebar.viewSizeExtent;
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
      children.push(c('eb-view', {
        ref: view.id,
        id: view.id,
        key: view.id,
        staticClass: `eb-layout-panel-view eb-layout-view ${this.layout._combineViewSizeClass(viewSize)}`,
        style: {
          zIndex: view.zIndex + '',
          width: `${viewSizeExtent.width}px`,
        },
        attrs: _viewAttrs,
        props: {
          size: viewSize,
          sizeExtent: viewSizeExtent,
        },
        on: {
          'view:ready': view => {
            this.onViewReady(view);
          },
        },
      }));
    }
    return c('div', {
      staticClass: 'eb-layout-group eb-layout-scene eb-layout-scene-panel',
    }, children);
  },
  props: {
    side: {
      type: String,
    }
  },
  data() {
    return {
      viewIndex: 1,
    }
  },
  computed: {
    layout() {
      return this.sidebar.layout;
    },
    sidebar() {
      return this.$parent.$parent;
    },
    views() {
      return this.sidebar.options.views;
    }
  },
  methods: {
    createView({ ctx, panel }) {
      return new Promise(resolve => {
        const _viewIndex = ++this.viewIndex;
        this.views.push({
          id: this.$meta.util.nextId('layoutgroupview'),
          panel,
          zIndex: _viewIndex,
          callback: ({ view }) => {
            this.$nextTick(() => {
              resolve({ view, options: null });
            });
          },
        });
      });
    },
    onViewReady(view) {
      // view
      const _view = this.views.find(item => item.id === view.id);
      // route
      const url = _view.panel.url;
      this.$meta.vueLayout._patchRouter.loadRoute(url, route => {
        if (!route) throw new Error(`not found route: ${url}`);
        // callback must not be null
        if (!_view.callback) {
          console.log(_view.id, url);
        }
        // callback
        _view.callback({ view });
        delete _view.callback;
      });
    },
    getView(viewId) {
      return this.$refs[viewId];
    },
  },
};

</script>
<style scoped>
</style>
