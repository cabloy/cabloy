export default {
  data() {
    return {};
  },
  methods: {
    page_ptr() {
      return true;
    },
    page_onGetTitle() {
      let title;
      if (this.base.item) {
        if (this.container.mode === 'edit') {
          title = this.base.item.atomName;
        } else {
          title = this.base.item.atomNameLocale || this.base.item.atomName || this.base.item._meta?.atomName;
        }
      }
      if (!title) {
        title = this.base.atomClassBase.titleLocale;
      }
      return this.page_getDirtyTitle(title);
      // return `${name}: ${this.base.item.atomName}`;
      // title = this.container.mode === 'edit' ? this.$text('Edit') : this.$text('View');
    },
    page_onGetTitleSub() {
      const stage = this.base_getCurrentStage();
      if (!stage || stage === 'formal') return '';
      return this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
    },
  },
};
