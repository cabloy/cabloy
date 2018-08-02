<script>
export default {
  render(c) {
    const children = [];
    if (this.views) {
      for (const view of this.views) {
        const _viewAttrs = {
          id: view.id,
          init: false,
          pushState: false,
          stackPages: true,
          pushStateOnLoad: false,
          preloadPreviousPage: false,
        };
        children.push(c('eb-view', {
          ref: view.id,
          id: view.id,
          key: view.id,
          staticClass: 'eb-layout-view',
          attrs: _viewAttrs,
          on: {
            'view:ready': view => {
              this.onViewReady(view);
            },
            'view:title': data => {
              this.onViewTitle(data);
            },
          },
        }));
      }
    }
    const views = c('div', children);
    return views;
  },
  props: {
    groupId: {
      type: String,
    },
    views: {
      type: Array,
    },
  },
  computed: {
    size() {
      return this.$parent.$parent.$parent.$parent.size;
    },
    tabs() {
      return this.$parent.$parent.$parent.$parent.tabs;
    },
  },
  methods: {
    onViewReady(view) {
      // view
      const _view = this.views.find(item => item.id === view.id);
      // route
      this.$meta.vueLayout.router.loadRoute(_view.url, route => {
        // width
        const meta = route.route.component.meta;
        const size = (meta && meta.size) || 'small';
        let width;
        if (size === 'small') {
          width = this.size.small;
        } else {
          width = this.size.middle;
        }
        // left
        let left;
        if (this.views.length === 1) {
          left = (this.size.width - width) / 2;
        } else {
          left = this.size.spacing;
        }
        this.$$(view.$el).css({
          width: `${width}px`,
          left: `${left}px`,
        });
        // callback
        _view.callback(view);
        delete _view.callback;
      });
    },
    onViewTitle(data) {
      const tab = this.tabs.find(tab => tab.id === this.groupId);
      if (!tab.title) tab.title = data.title;
    },
  },
};

</script>
<style scoped>


</style>
