export default {
  meta: {
    component: false,
  },
  computed: {
    contextParams() {
      return this.$f7route.context && this.$f7route.context.params;
    },
  },
  methods: {
    contextCallback(code, data) {
      if (this.$f7route.context.callback) {
        this._callbackCalled = true;
        this.$f7route.context.callback(code, data);
      }
    },
  },
  beforeDestroy() {
    if (this.$f7route.context.callback) {
      this.$f7route.context.callback(this._callbackCalled ? null : false);
    }
  },
};

