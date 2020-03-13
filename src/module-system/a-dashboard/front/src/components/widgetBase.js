export default {
  props: {
    widget: {
      type: Object,
    },
  },
  mounted() {
    this.$emit('widgetReal:ready', this);
  },
  beforeDestroy() {
    this.$emit('widgetReal:destroy', this);
  },
};
