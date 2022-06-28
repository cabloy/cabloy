export default {
  methods: {
    backLink(ctx) {
      let backLink = false;
      const routeDiff = this.$meta.util.viewRouterDid(ctx.$view) ? 2 : 1;
      if (!this.$meta.util.historyUrlEmpty(ctx.$f7router.history[ctx.$f7router.history.length - routeDiff])) {
        backLink = true;
      } else {
        const $el = ctx.$$(ctx.$el);
        const $view = $el.parents('.eb-layout-view');
        if ($view.is('.eb-layout-group-view') && parseInt($view.data('index')) > 0) {
          backLink = true;
        }
      }
      return backLink;
    },
    closeLink(ctx) {
      return true;
    },
    sizeLink(ctx) {
      return 'restore';
    },
    onCloseClick(ctx) {
      console.log('onCloseClick');
    },
    onSizeClick(ctx) {
      console.log('onSizeClick');
    },
  },
};
