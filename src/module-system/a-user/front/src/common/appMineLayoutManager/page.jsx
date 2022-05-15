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
      const __appKeyDefault = this.$config.appKey.default;
      if (this.container.appKey === __appKeyDefault) return this.$text('Apps');
      if (!this.base.appItem) return '';
      return this.base.appItem.atomNameLocale;
    },
    page_onGetTitleSub() {
      return '';
    },
  },
};
