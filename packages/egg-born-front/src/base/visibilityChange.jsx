export default {
  data() {
    return {
      visibilityState: document.visibilityState === 'visible',
    };
  },
  created() {
    document.addEventListener('visibilitychange', () => {
      const visibilityState = document.visibilityState === 'visible';
      if (this.visibilityState !== visibilityState) {
        this.visibilityState = visibilityState;
        this.$emit('visibilityChange', visibilityState);
      }
    });
  },
  methods: {},
};
