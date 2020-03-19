// eslint-disable-next-line
export default function(Vue) {
  return {
    meta: {
    },
    props: {
      section: {
        type: Object,
      },
    },
    data() {
      return {
      };
    },
    mounted() {
      this.$emit('sectionReal:ready', this);
    },
    beforeDestroy() {
      this.$emit('sectionReal:destroy', this);
    },
  };
}
