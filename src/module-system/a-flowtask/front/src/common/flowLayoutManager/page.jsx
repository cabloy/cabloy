export default {
  data() {
    return {
    };
  },
  methods: {
    page_getTitle() {
      if (!this.base_ready) return '';
      return `${this.$text('FlowTitle')}: ${this.base.data.flow.atomName}`;
    },
    page_getSubtitle() {
      return null;
    },
  },
};
