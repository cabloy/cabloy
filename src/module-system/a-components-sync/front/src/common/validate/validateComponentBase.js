export default {
  data() {
    return {};
  },
  mounted() {
    this.context.setComponentInstance(this);
  },
  beforeDestroy() {
    this.context.setComponentInstance(null);
  },
};
