<script>
const _heightHeader = 56;
const _heightToolbar = 48;
const _diffDesktop = 8;
export default {
  name: 'eb-box',
  render(c) {
    return c('div', { ref: 'box' }, this.$slots.default);
  },
  props: {
    toolbar: {
      type: Boolean,
      default: false,
    }
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
      const size = this.$view.getSizeExtent();
      if (size) {
        let height = size.height - (this.$device.desktop ? _heightHeader + _diffDesktop : _heightHeader);
        if (this.toolbar) {
          height -= _heightToolbar;
        }
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
