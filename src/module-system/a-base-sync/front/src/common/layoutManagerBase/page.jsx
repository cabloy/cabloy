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
      return false;
    },
    page_infinite() {
      return false;
    },
    page_onRefresh(done) {
      done && done();
      return this.data_onPageRefresh(true);
    },
    page_onInfinite() {
      return this.data_onPageInfinite();
    },
    page_onClear() {
      return this.data_onPageClear();
    },
    page_getTitle() {
      // 1. container
      if (this.container.params?.pageTitle) return this.container.params?.pageTitle;
      // 2. config page title
      const configPageTitle = this.$meta.util.getProperty(this.layout.config, 'page.title');
      if (configPageTitle) return this.$text(configPageTitle);
      // 3. page_onGetTitle
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
    page_getProps() {
      if (!this.layout.config) return null;
      const configPage = this.layout.config.page;
      if (!configPage) return null;
      return configPage.props;
    },
  },
};
