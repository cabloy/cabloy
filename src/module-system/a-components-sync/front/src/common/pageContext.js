export default {
  meta: {
    component: false,
  },
  computed: {
    contextParams() {
      return this.$f7Route.context && this.$f7Route.context.params;
    },
  },
  methods: {
    contextCallback(code, data) {
      if (this.$f7Route.context.callback) {
        this._callbackCalled = true;
        this.$f7Route.context.callback(code, data);
      }
    },
  },
  beforeDestroy() {
    if (this.$f7Route.context.callback) {
      this.$f7Route.context.callback(this._callbackCalled ? null : false);
    }
  },
};

