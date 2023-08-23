import viewSizeChange from '../common/viewSizeChange.jsx';
export default {
  meta: {
    global: true,
  },
  name: 'eb-box',
  mixins: [viewSizeChange],
  render(c) {
    return c('div', { ref: 'box' }, this.$slots.default);
  },
  props: {
    header: {
      type: Boolean,
      default: true,
    },
    subnavbar: {
      type: Boolean,
      default: false,
    },
    toolbar: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  methods: {
    onViewSizeChange(size) {
      this.$$(this.$refs.box).css({
        position: 'absolute',
        height: `${size.height}px`,
        width: `${size.width}px`, // '100%',
      });
      this.$emit('size', size);
    },
  },
};
