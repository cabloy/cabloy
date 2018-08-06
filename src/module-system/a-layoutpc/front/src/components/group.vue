<script>
export default {
  render(c) {
    const children = [];
    if (this.views) {
      for (let index = 0; index < this.views.length; index++) {
        const view = this.views[index];
        const _viewAttrs = {
          id: view.id,
          init: false,
          pushState: false,
          stackPages: true,
          pushStateOnLoad: false,
          preloadPreviousPage: false,
          'data-index': index,
        };
        children.push(c('eb-view', {
          ref: view.id,
          id: view.id,
          key: view.id,
          staticClass: `eb-layout-view eb-layout-view-size-${view.size}`,
          attrs: _viewAttrs,
          props: {
            size: view.size,
          },
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
    return c('div', children);
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
    groups() {
      return this.$parent.$parent.$parent.$parent.groups;
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
        this.$$(view.$el).css({
          width: `${width}px`,
        });
        // title
        let title;
        const viewIndex = parseInt(this.$$(view.$el).data('index'));
        if (viewIndex === 0) {
          title = meta && meta.title;
          if (title) title = this.$text(title);
        }
        // reLayout
        this.reLayout();
        // callback
        _view.callback({ view, title, size });
        delete _view.callback;
      });
    },
    reLayout() {
      this.$nextTick(() => {
        this._reLayout();
      });
    },
    _reLayout() {
      // space
      let space = this.size.width;
      let spacing = 0;
      for (let i = this.views.length - 1; i >= 0; i--) {
        const view = this.$refs[this.views[i].id];
        const space2 = space - this.$$(view.$el).width() - spacing;
        if (space2 > 0) {
          space = space2;
          spacing = this.size.spacing;
        } else {
          break;
        }
      }
      // left
      let left = parseInt(this.size.width - space / 2);
      spacing = 0;
      for (let i = this.views.length - 1; i >= 0; i--) {
        const view = this.$refs[this.views[i].id];
        left -= this.$$(view.$el).width() + spacing;
        spacing = this.size.spacing;
        const _left = this.$$(view.$el).css('left');
        if (_left === 'auto' || _left === '0px') {
          this.$$(view.$el).css({
            left: `${left}px`,
          });
        } else {
          if (parseInt(_left) !== left) {
            this.$$(view.$el).animate({
              left,
            }, { duration: 600 });
          }
        }
      }
    },
    onViewTitle(data) {
      const viewIndex = parseInt(this.$$(data.page.$view.$el).data('index'));
      if (viewIndex === 0) {
        const group = this.groups.find(group => group.id === this.groupId);
        if (data.title) group.title = data.title;
      }
    },
    getView(viewId) {
      return this.$refs[viewId];
    },
  },
};

</script>
<style scoped>


</style>
