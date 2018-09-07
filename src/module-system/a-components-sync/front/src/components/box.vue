<script>
export default {
  name: 'eb-box',
  render(c) {
    return c('div', { ref: 'box' }, this.$slots.default);
  },
  data() {
    return {
      _unwatch: null,
    };
  },
  mounted() {
    this._unwatch = this.$view.$watch('sizeExtent', () => {
      this.onSize();
    });
    this.onSize();
  },
  beforeDestroy() {
    if (this._unwatch) {
      this._unwatch();
      this._unwatch = null;
    }
  },
  methods: {
    onSize() {
      const size = this.$view.sizeExtent;
      if (size) {
        const height = size.height - (this.$device.desktop ? 64 : 56);
        this.$$(this.$refs.box).css({
          position: 'absolute',
          height: `${height}px`,
          width: '100%',
        });
        this.$emit('size', { width: size.width, height });
      }
    },
  },
};

</script>
<style>


</style>
