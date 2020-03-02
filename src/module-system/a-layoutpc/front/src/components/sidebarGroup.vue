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
        'data-size': this.sidebar.size,
      };
      children.push(c('eb-view', {
        ref: view.id,
        id: view.id,
        key: view.id,
        staticClass: `eb-layout-panel-view ${this.layout._combineViewSizeClass(viewSize)}`,
        style: {},
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
    return {}
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
    createView({ ctx, url }) {
      return new Promise(resolve => {
        this.views.push({
          id: this.$meta.util.nextId('layoutgroupview'),
          url,
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
      this.$meta.vueLayout._patchRouter.loadRoute(_view.url, route => {
        if (!route) throw new Error(`not found route: ${_view.url}`);
        // width
        const width = this.sidebar.options.panelWidth;
        this.$$(view.$el).css({
          width: `${width}px`,
        });
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
