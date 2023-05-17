export default {
  state() {
    return {
      initialized: false,
      visibilityState: undefined,
      // visibilityState: document.visibilityState === 'visible', // document not ready
    };
  },
  actions: {
    initialize() {
      if (this.initialized) return;
      this.initialized = true;
      this.updateVisibilityState();
      document.addEventListener('visibilitychange', () => {
        this.updateVisibilityState();
      });
    },
    updateVisibilityState() {
      this.visibilityState = document.visibilityState === 'visible';
    },
    subscribe(callback) {
      this.initialize();
      return this.$subscribe((mutation, state) => {
        callback(state.visibilityState);
      });
    },
  },
};
