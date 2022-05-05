export default {
  data() {
    return {};
  },
  methods: {
    page_onGetTitle() {
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
    page_onGetTitleSub() {
      const stage = this.base_getCurrentStage();
      if (!stage || stage === 'formal') return '';
      return this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
    },
  },
};
