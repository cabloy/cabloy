/** @module a-base/front/mixins/ebActionBase */

/** ebActionBase
 */
export default {
  /**
   * @property {object} ctx - Generally speaking, it is the caller component
   * @property {object} action - Action info
   * @property {object} item - Action Parameters
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
