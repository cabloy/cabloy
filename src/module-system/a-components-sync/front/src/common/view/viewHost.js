export default {
  methods: {
    getHostEl() {
      const view = this.$$(this.$el);
      const views = view.parents('.views');
      return views.length > 0 ? views : view;
    },
    navigate(url, options) {
      let _options = options || {};
      if (!_options.ctx) {
        // _options = this.$utils.extend({}, _options, { ctx: this });
        _options = Object.assign({}, _options, { ctx: this });
      }
      this.$meta.vueLayout.navigate(url, _options);
    },
    close() {
      this.$f7router.close();
    },
    inPanel() {
      const view = this.$$(this.$el);
      return view.is('.eb-layout-panel-view');
    },
    returnTo(returnTo, options) {
      if (!returnTo) {
        const modeIfEmpty = (options && options.modeIfEmpty) || 'back';
        if (modeIfEmpty === 'back') {
          this.$f7router.back();
        } else {
          this.$view.close();
        }
      } else if (returnTo.indexOf('http://') === 0 || returnTo.indexOf('https://') === 0) {
        window.location.assign(returnTo);
      } else {
        const navigateOptions = (options && options.navigateOptions) || { target: '_self', reloadCurrent: true };
        this.$view.navigate(returnTo, navigateOptions);
      }
    },
  },
};
