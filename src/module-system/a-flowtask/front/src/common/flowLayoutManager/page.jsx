export default {
  data() {
    return {
    };
  },
  methods: {
    page_getTitle() {
      if (!this.base_ready) return '';
      return `${this.$text('FlowTitle')}: ${this.base.data.atom.atomName}`;
    },
    page_getSubtitle() {
      return null;
    },
  },
};
