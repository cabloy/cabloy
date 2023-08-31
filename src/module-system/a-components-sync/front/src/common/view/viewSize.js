export default {
  props: {
    size: {
      type: String,
      default: 'small',
    },
    sizeExtent: {
      type: Object,
    },
  },
  methods: {
    getSizeExtent() {
      return this.sizeExtent;
      // not valid if the group of views is hidden
      // const view = this.$$(this.$el);
      // const size = {
      //   width: view.width(),
      //   height: view.height(),
      // };
      // return size;
    },
  },
};
