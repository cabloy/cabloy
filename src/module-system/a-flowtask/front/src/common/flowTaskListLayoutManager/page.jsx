export default {
  data() {
    return {
    };
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
      if (mode === 'claimings') {
        return `${this.$text('Task')}: ${this.$text('Claimings')}`;
      } else if (mode === 'handlings') {
        return `${this.$text('Task')}: ${this.$text('Handlings')}`;
      } else if (mode === 'completeds') {
        return `${this.$text('Task')}: ${this.$text('Completeds')}`;
      }
      return this.$text('Task');
    },
    page_getSubtitle() {
      return '';
    },
  },
};
