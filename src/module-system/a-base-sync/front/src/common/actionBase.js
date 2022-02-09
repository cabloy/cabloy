/** ebActionBase
 * @exports a-base/front/mixins/ebActionBase
 */
export default {
  /**
   * @property {object} props
   * @property {object} props.ctx - Generally speaking, it is the caller component
   * @property {object} props.action - Action info
   * @property {object} props.item - Action Parameters
   */
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
