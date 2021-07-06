export default {
  data() {
    return {};
  },
  methods: {
    page_getTitle() {
      const titleBase = this.$text('FlowTitle');
      if (!this.base_ready) return titleBase;
      return `${titleBase}: ${this.base.data.flow.flowName}`;
    },
    page_getSubtitle() {
      return null;
    },
  },
};
