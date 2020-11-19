export default {
  data() {
    return {
    };
  },
  methods: {
    page_getTitle() {
      if (!this.base_ready) return '';
      return `${this.$text('Task')}: ${this.base_flow.flowName}`;
    },
    page_getSubtitle() {
      return null;
    },
  },
};
