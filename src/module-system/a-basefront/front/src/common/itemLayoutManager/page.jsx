export default {
  data() {
    return {};
  },
  methods: {
    page_onGetTitle() {
      let title;
      if (!this.base.item) {
        title = this.container.mode === 'edit' ? this.$text('Edit') : this.$text('View');
      } else {
        title = this.base.item.atomNameLocale || this.base.item.atomName || this.base.item._meta?.atomName;
      }
      return this.page_getDirtyTitle(title);
      // return `${name}: ${this.base.item.atomName}`;
    },
    page_onGetTitleSub() {
      const stage = this.base_getCurrentStage();
      if (!stage || stage === 'formal') return '';
      return this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
    },
  },
};
