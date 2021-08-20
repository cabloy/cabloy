export default {
  data() {
    return {
      pageDirty: false,
    };
  },
  methods: {
    page_setDirty(dirty) {
      if (this.pageDirty === dirty) return;
      this.pageDirty = dirty;
      this.$pageContainer.setPageDirty(dirty);
    },
    page_getTitle() {
      let title;
      if (!this.base.item) {
        title = this.container.mode === 'edit' ? this.$text('Edit') : this.$text('View');
      } else {
        title = this.base.item.atomName;
      }
      if (this.pageDirty) {
        title = `* ${title}`;
      }
      return title;
      // return `${name}: ${this.base.item.atomName}`;
    },
    page_getSubtitle() {
      const stage = this.base_getCurrentStage();
      if (!stage || stage === 'formal') return '';
      return this.$text(stage.replace(stage[0], stage[0].toUpperCase()));
    },
  },
};
