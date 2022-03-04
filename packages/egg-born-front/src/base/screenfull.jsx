import screenfull from 'screenfull';
export default {
  data() {
    return {
      isFullscreen: screenfull.isEnabled && screenfull.isFullscreen,
      isEnabled: screenfull.isEnabled,
    };
  },
  created() {
    if (this.isEnabled) {
      screenfull.on('change', () => {
        const isFullscreen = screenfull.isFullscreen;
        if (this.isFullscreen !== isFullscreen) {
          this.isFullscreen = isFullscreen;
          this.$emit('change', isFullscreen);
        }
      });
    }
  },
  methods: {
    instance() {
      return screenfull;
    },
    request(...args) {
      return screenfull.request(...args);
    },
    exit(...args) {
      return screenfull.exit(...args);
    },
    toggle(...args) {
      return screenfull.toggle(...args);
    },
  },
};
