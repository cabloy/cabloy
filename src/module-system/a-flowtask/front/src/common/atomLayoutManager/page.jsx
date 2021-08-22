export default {
  data() {
    return {};
  },
  methods: {
    page_getTitle() {
      if (!this.base_ready) return '';
      const title = `${this.$text('Task')}: ${this.base_flow.flowName}`;
      return this.page_getDirtyTitle(title);
    },
    page_getSubtitle() {
      return null;
    },
  },
};
