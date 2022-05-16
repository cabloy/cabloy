export default {
  data() {
    return {};
  },
  methods: {
    page_ptr() {
      return false;
    },
    page_infinite() {
      return false;
    },
    page_onGetTitle() {
      // default title
      const inPanel = this.$view.inPanel();
      const titleDefault = inPanel ? this.$text('Apps') : this.$text('Home');
      // app title
      const __appKeyDefault = this.$config.appKey.default;
      if (this.container.appKey === __appKeyDefault) return titleDefault;
      if (!this.base.appItem) return titleDefault; // default
      if (this.base.appItem.isolate) return titleDefault;
      return this.base.appItem.atomNameLocale;
    },
    page_onGetTitleSub() {
      return '';
    },
  },
};
