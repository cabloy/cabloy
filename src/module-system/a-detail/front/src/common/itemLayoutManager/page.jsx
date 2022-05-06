export default {
  data() {
    return {};
  },
  methods: {
    page_onGetTitle() {
      let title;
      if (!this.base.item) {
        title = this.$text('Details');
      } else {
        title = this.base.item.detailName;
      }
      return this.page_getDirtyTitle(title);
    },
    page_onGetTitleSub() {
      return '';
    },
  },
};
