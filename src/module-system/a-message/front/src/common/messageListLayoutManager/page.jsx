export default {
  data() {
    return {};
  },
  methods: {
    page_onRefresh(done) {
      done && done();
      this.layout.instance && this.layout.instance.onPageRefresh(true);
    },
    page_onInfinite() {
      this.layout.instance && this.layout.instance.onPageInfinite();
    },
    page_onClear() {
      this.layout.instance && this.layout.instance.onPageClear();
    },
    page_onGetTitle() {
      return `${this.$text('Messages')}: ${this.container.messageClass.info.titleLocale}`;
    },
    page_onGetTitleSub() {
      return '';
    },
  },
};
