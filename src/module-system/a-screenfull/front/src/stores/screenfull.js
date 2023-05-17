import screenfull from 'screenfull';

export default {
  state() {
    return {
      isFullscreen: screenfull.isEnabled && screenfull.isFullscreen,
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
  actions: {
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
