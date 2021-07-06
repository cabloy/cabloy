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
    page_getTitle() {
      const mode = this.container.options && this.container.options.mode;
      if (mode === 'mine') {
        return `${this.$text('Flow')}: ${this.$text('Initiateds')}`;
      } else if (mode === 'others') {
        return `${this.$text('Flow')}: ${this.$text('Participateds')}`;
      } else if (mode === 'history') {
        return `${this.$text('Flow')}: ${this.$text('Ends')}`;
      }
      return this.$text('Flow');
    },
    page_getSubtitle() {
      return '';
    },
  },
};
