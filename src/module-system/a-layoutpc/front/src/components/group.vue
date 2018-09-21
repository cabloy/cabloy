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
            sizeExtent: view.sizeExtent,
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
      this.$meta.vueLayout._patchRouter.loadRoute(_view.url, route => {
        if (!route) throw new Error(`not found route: ${_view.url}`);
        // width
        const meta = route.route.component.meta;
        const size = (meta && meta.size) || 'small';
        const width = this.size[size];
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
        // size
        _view.size = size;
        _view.sizeExtent = {
          width: this.size[size],
          height: this.size.main,
        };
        // reLayout
        this.reLayout();
        // callback
        _view.callback({ view, title });
        delete _view.callback;
      });
    },
    resize() {
      this.$nextTick(() => {
        this._resize();
        this._reLayout();
      });
    },
    _resize() {
      for (const view of this.views) {
        const _view = this.$refs[view.id];
        const width = this.size[view.size];
        this.$$(_view.$el).css({
          width: `${width}px`,
        });
        view.sizeExtent = {
          width: this.size[view.size],
          height: this.size.main,
        };
      }
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
      let spacingLeft = null;
      for (let i = this.views.length - 1; i >= 0; i--) {
        const view = this.$refs[this.views[i].id];
        const width = this.$$(view.$el).width();
        left -= width + spacing;
        spacing = this.size.spacing;

        // solution: 1
        if (left < 0 && spacingLeft === null) {
          const _viewPrev = this.views[i + 1];
          spacingLeft = (left + width + spacing < spacing * 2) && _viewPrev.size !== 'small';
        }
        // fix
        if (left < 0 && left + width > 0) {
          left -= left + width;
        }
        // display
        if (spacingLeft !== true) {
          this.$$(view.$el).show();
        } else {
          this.$$(view.$el).hide();
        }

        // solution: 2
        // left = left >= 0 ? left : left - 20;

        // left
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
