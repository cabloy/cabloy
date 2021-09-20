export default {
  props: {
    ctx: {
      type: Object,
    },
    action: {
      type: Object,
    },
    item: {
      type: Object,
    },
  },
  created() {
    const { ctx } = this.$props;
    if (ctx && ctx.$createElement) {
      this.$createElement = ctx.$createElement;
    }
  },
  beforeDestroy() {
    this.$createElement = null;
  },
};
