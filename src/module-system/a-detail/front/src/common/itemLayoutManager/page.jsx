export default {
  data() {
    return {
    };
  },
  methods: {
    page_getTitle() {
      const details = this.$text('Details');
      if (!this.base.item) return details;
      return this.base.item.detailName;
    },
    page_getSubtitle() {
      return '';
    },
  },
};
