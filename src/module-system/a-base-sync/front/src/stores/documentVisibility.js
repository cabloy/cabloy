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
      this.visibilityState = document.visibilityState === 'visible';
      document.addEventListener('visibilitychange', () => {
        const visibilityState = document.visibilityState === 'visible';
        if (this.visibilityState !== visibilityState) {
          this.visibilityState = visibilityState;
        }
      });
    },
    subscribe(callback) {
      this.initialize();
      return this.$subscribe((mutation, state) => {
        callback(state.visibilityState);
      });
    },
  },
};
