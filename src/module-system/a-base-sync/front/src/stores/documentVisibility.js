export default {
  state() {
    return {
      visibilityState: document.visibilityState === 'visible',
      initialized: false,
    };
  },
  actions: {
    initialize() {
      if (this.initialized) return;
      this.initialized = true;
      document.addEventListener('visibilitychange', () => {
        const visibilityState = document.visibilityState === 'visible';
        if (this.visibilityState !== visibilityState) {
          this.visibilityState = visibilityState;
        }
      });
    },
    subscribe(callback) {
      this.initialize();
      this.$subscribe((mutation, state) => {
        callback(state.visibilityState);
      });
    },
  },
};
