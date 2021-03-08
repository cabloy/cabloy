export default {
  data() {
    return {
      viewSize: {
        size: null,
        unwatch: null,
        heightHeader: 56,
        heightSubnavbar: 48,
        heightToolbar: 48,
        diffDesktop: 8,
      },
    };
  },
  mounted() {
    this.viewSize.unwatch = this.$view.$watch('sizeExtent', () => {
      this._viewSizeChange();
    });
    this._viewSizeChange();
  },
  beforeDestroy() {
    if (this.viewSize.unwatch) {
      this.viewSize.unwatch();
      this.viewSize.unwatch = null;
    }
  },
  methods: {
    _viewSizeChange() {
      const size = this.$view.getSizeExtent();
      if (!size) return;
      let height = size.height;
      if (this.$meta.vueApp.layout === 'pc') {
        height -= this.viewSize.diffDesktop;
      }
      if (this.header === true) {
        height -= this.viewSize.heightHeader;
      }
      if (this.subnavbar === true) {
        height -= this.viewSize.heightSubnavbar;
      }
      if (this.toolbar === true) {
        height -= this.viewSize.heightToolbar;
      }
      this.viewSize.size = { width: size.width, height };
      if (this.onViewSizeChange) {
        this.onViewSizeChange(this.viewSize.size);
      }
    },
  },
};
