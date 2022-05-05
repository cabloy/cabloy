export default {
  data() {
    return {};
  },
  computed: {
    page_title() {
      return this.page_getTitle();
    },
  },
  methods: {
    page_ptr() {
      return true;
    },
    page_infinite() {
      return true;
    },
    page_onRefresh(done) {
      done && done();
      this.data_onPageRefresh(true);
    },
    page_onInfinite() {
      this.data_onPageInfinite();
    },
    page_onClear() {
      this.data_onPageClear();
    },
    page_getTitle() {
      //
      if (this.container.params && this.container.params.pageTitle) return this.container.params.pageTitle;
      //
      if (this.page_onGetTitle) {
        return this.page_onGetTitle();
      }
    },
    page_getSubtitle() {
      if (this.page_onGetTitleSub) {
        return this.page_onGetTitleSub();
      }
      return '';
    },
  },
};
