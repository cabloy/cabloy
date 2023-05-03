export default {
  data() {
    return {};
  },
  methods: {
    page_ptr() {
      return true;
    },
    page_infinite() {
      return true;
    },
    page_onGetTitle() {
      const atomClassBase = this.base.atomClassBase;
      const atomClassTitle = atomClassBase && atomClassBase.titleLocale;
      if (this.container.scene === 'select') {
        if (!atomClassBase) return `${this.$text('Selected')} ${this.$text('Atom')}`;
        return `${this.$text('Selected')} ${atomClassTitle}`;
      } else if (this.container.scene === 'selecting') {
        if (!atomClassBase) return `${this.$text('Select')} ${this.$text('Atom')}`;
        return `${this.$text('Select')} ${atomClassTitle}`;
      } else if (this.container.scene === 'search') {
        if (!atomClassBase) return `${this.$text('Search')} ${this.$text('Atom')}`;
        return `${this.$text('Search')} ${atomClassTitle}`;
      }
      if (!atomClassBase) return this.$text('Atom');
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
