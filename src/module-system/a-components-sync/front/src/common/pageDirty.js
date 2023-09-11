export default {
  data() {
    return {
      page_dirty: false,
    };
  },
  methods: {
    page_getDirty() {
      return this.page_dirty;
    },
    page_setDirty(dirty) {
      if (this.page_dirty === dirty) return;
      this.page_dirty = dirty;
      this.$page.setPageDirty(dirty);
    },
    page_getDirtyTitle(title) {
      if (!this.page_dirty) return title;
      return `* ${title}`;
    },
  },
};
