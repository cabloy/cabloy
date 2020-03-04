<script>
export default {
  render(c) {
    const children = [];
    if (this.views) {
      for (let index = 0; index < this.views.length; index++) {
        const view = this.views[index];
        const viewSize = this._combineViewSize(view.sizeWill, index);
        const viewSizeExtent = {
          width: this.size[viewSize],
          height: this.size.main,
        };
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
          staticClass: `eb-layout-group-view eb-layout-view ${this.layout._combineViewSizeClass(viewSize)}`,
          attrs: _viewAttrs,
          props: {
            size: viewSize,
            sizeExtent: viewSizeExtent,
          },
          style: {
            width: `${viewSizeExtent.width}px`,
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
    onViewReady(view) {
      // view
      const _view = this.views.find(item => item.id === view.id);
      // route
      this.$meta.vueLayout._patchRouter.loadRoute(_view.url, route => {
        if (!route) throw new Error(`not found route: ${_view.url}`);
        // width
        const meta = route.route.component.meta;
        const sizeWill = (meta && meta.size) || 'small';
        // title
        let title;
        const viewIndex = parseInt(this.$$(view.$el).data('index'));
        if (viewIndex === 0) {
          title = meta && meta.title;
          if (title) title = this.$text(title);
        }
        // size
        _view.sizeWill = sizeWill;
        // reLayout
        this.reLayout();
        // callback
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
    _combineViewSize(sizeWill, indexCurrent) {
      // try
      if (sizeWill === 'small' && this.views.length === 1) {
        sizeWill = 'medium';
      } else if (sizeWill === 'large' && this.views.length > indexCurrent + 1 && this.views[indexCurrent + 1].sizeWill === 'small') {
        sizeWill = 'medium';
      }
      // adjust
      if (sizeWill === 'large') return this.layout.enoughLarge ? 'large' : (this.layout.enoughMedium ? 'medium' : 'small');
      if (sizeWill === 'medium') return this.layout.enoughMedium ? 'medium' : 'small';
      return 'small';
    },
    _reLayout() {
      // space
      let space = this.size.width;
      let spacing = 0;
      for (let i = this.views.length - 1; i >= 0; i--) {
        const view = this.$refs[this.views[i].id];
        // width
        const viewSize = this._combineViewSize(this.views[i].sizeWill, i);
        const width = this.size[viewSize];
        // space
        const space2 = space - width - spacing;
        if (space2 > 0) {
          space = space2;
          spacing = this.size.spacing;
        } else {
          break;
        }
      }
      // sidebar
      const sidebarLeft = this.layout._sidebarWidth('left');

      // left
      let left = parseInt(this.size.width - space / 2 + sidebarLeft);
      spacing = 0;
      let spacingLeft = null;
      for (let i = this.views.length - 1; i >= 0; i--) {
        const view = this.$refs[this.views[i].id];
        // width
        const viewSize = this._combineViewSize(this.views[i].sizeWill, i);
        const width = this.size[viewSize];
        // space
        left -= width + spacing;
        spacing = this.size.spacing;

        // solution: 1
        if (left < 0 && spacingLeft === null) {
          const _viewPrev = this.views[i + 1];
          spacingLeft = (left + width + spacing < spacing * 2) && this._combineViewSize(_viewPrev.sizeWill, i + 1) !== 'small';
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
        const newStyle = {
          left: `${left}px`,
        };
        this.$$(view.$el).css(newStyle);
      }
    },
    onViewTitle(data) {
      this.groups.onViewTitle(this.groupId, data);
    },
    getView(viewId) {
      return this.$refs[viewId];
    },
  },
};

</script>
<style scoped>
</style>
