import screenfull from 'screenfull';

export default {
  state() {
    return {
      isFullscreen: screenfull.isEnabled && screenfull.isFullscreen,
      isEnabled: screenfull.isEnabled,
    };
  },
  created() {},
  actions: {},
};
