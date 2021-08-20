export default {
  data() {
    return {
      pageDirty: false,
    };
  },
  computed: {
    page_title() {
      return this.page_getTitle();
    },
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
        title = this.$text('Details');
      } else {
        title = this.base.item.detailName;
      }
      if (this.pageDirty) {
        title = `* ${title}`;
      }
      return title;
    },
    page_getSubtitle() {
      return '';
    },
  },
};
