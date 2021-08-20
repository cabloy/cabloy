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
      const atomClass = this.getAtomClass(this.container.atomClass);
      const atomClassTitle = atomClass && atomClass.titleLocale;
      if (this.container.scene === 'select') {
        if (!atomClass) return `${this.$text('Selected')} ${this.$text('Atom')}`;
        return `${this.$text('Selected')} ${atomClassTitle}`;
      } else if (this.container.scene === 'selecting') {
        if (!atomClass) return `${this.$text('Select')} ${this.$text('Atom')}`;
        return `${this.$text('Select')} ${atomClassTitle}`;
      } else if (this.container.scene === 'search') {
        if (!atomClass) return `${this.$text('Search')} ${this.$text('Atom')}`;
        return `${this.$text('Search')} ${atomClassTitle}`;
      }
      if (!atomClass) return this.$text('Atom');
      // return `${this.$text('Atom')}: ${atomClassTitle}`;
      return atomClassTitle;
    },
    page_getSubtitle() {
      const stage = this.base_getCurrentStage();
      if (!stage || stage === 'formal') return '';
      return this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
    },
  },
};
