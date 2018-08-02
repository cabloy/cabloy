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
              const _view = this.views.find(item => item.id === view.id);
              _view.callback(view);
              delete _view.callback;
            },
          },
        }));
      }
    }
    const views = c('div', children);
    return views;
  },
  props: {
    views: {
      type: Array,
    },
  },
  computed: {

  },
};

</script>
<style scoped>


</style>
