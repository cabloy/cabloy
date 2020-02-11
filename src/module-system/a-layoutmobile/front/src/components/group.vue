<script>
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
        init: false,
        pushState: pushStateView,
        stackPages: true,
        pushStateOnLoad: false,
        preloadPreviousPage: false,
        'data-index': index,
      };
      children.push(c('eb-view', {
        ref: view.id,
        id: view.id,
        key: view.id,
        staticClass: `eb-layout-view eb-layout-view-size-${this.size}`,
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
      }));
    }
    return c('div', {
      staticClass: 'eb-layout-group'
    }, children);
  },
  data() {
    return {
      views: [],
      viewIndex: 10000,
    }
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
      const viewIndex = parseInt(this.$$(view.$el).data('index'));
      window.setTimeout(() => {
        this.views.splice(viewIndex, 1);
        if (this.views.length === 0) {
          // hide group
          this.$$(this.$el).hide();

          // force tab show
          this.layout.tabShowed = true;
        }
      }, 1000);
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
    getView(viewId) {
      return this.$refs[viewId];
    },
  },
};

</script>
<style scoped>
</style>
