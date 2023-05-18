export default {
  data() {
    return {};
  },
  mounted() {
    this.context.setComponentInstance(this);
  },
  beforeDestroy() {
    this.context.removeComponentInstance(this);
  },
};
