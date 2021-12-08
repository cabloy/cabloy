import screenfull from 'screenfull';
export default {
  data() {
    return {
      isFullscreen: false,
      isEnabled: screenfull.isEnabled,
    };
  },
  created() {
    if (this.isEnabled) {
      screenfull.on('change', () => {
        this.isFullscreen = screenfull.isFullscreen;
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
