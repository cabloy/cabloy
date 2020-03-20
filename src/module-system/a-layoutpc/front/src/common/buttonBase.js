// eslint-disable-next-line
export default function(Vue) {
  return {
    meta: {
    },
    props: {
      button: {
        type: Object,
      },
    },
    data() {
      return {
      };
    },
    mounted() {
      this.$emit('buttonReal:ready', this);
    },
    beforeDestroy() {
      this.$emit('buttonReal:destroy', this);
    },
  };
}
